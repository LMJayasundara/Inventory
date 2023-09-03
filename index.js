const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const main_menu = require('./src/menu');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const { login, readItem, writeItem, updateItem, deleteItem, updatePass } = require('./src/fbdb');
let mainWindow, winMenu = null;
let isDialogOpen = false;
const USERNAME_SUFFIX = "@inventory.com";

async function checkInternetConnection() {
    setInterval(async () => {
        const isOnlineModule = await import('is-online');
        const online = await isOnlineModule.default();
        if (!online && !isDialogOpen) {
            isDialogOpen = true;
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'No Internet',
                message: 'Internet connection is not available.',
                buttons: ['Ok'],
                alwaysOnTop: true,
            }).then(() => {
                isDialogOpen = false;
            });
        }
    }, 15000);  // 15 seconds
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 780,
        minWidth: 1200,
        minHeight: 780,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        Menu.setApplicationMenu(null);
        [winMenu] = new main_menu(mainWindow);
        // mainWindow.openDevTools();
    });

    mainWindow.loadFile(path.join(__dirname, '/template/index.html'));
    mainWindow.webContents.send('version', app.getVersion());
};

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

//////////////////////////////////////////////////////////////////////////////////

function showErrWin(error_message) {
    dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Error!',
        message: error_message,
        buttons: ['Ok'],
        alwaysOnTop: true,
    });
}

ipcMain.handle('login', async (event, obj) => {
    const { username, password } = obj;

    if (username == '' || password == '') {
        showErrWin("Invalid Input")
    }
    else {
        await login(`${username}${USERNAME_SUFFIX}`, password).then(async(res)=> {
            if(res.data == true){
                const menu = Menu.buildFromTemplate(winMenu);
                Menu.setApplicationMenu(menu);
                mainWindow.webContents.send('state', "sub11");
                checkInternetConnection();
            } else {
                showErrWin(res.message)
            }
        });
    };
});

ipcMain.handle('reqHomeTbl', async (event, obj) => {
    let data = await readItem();
    mainWindow.webContents.send('resHomeTbl', data);
});

ipcMain.handle('reqAddnewTbl', async (event, obj) => {
    let data = await readItem();
    mainWindow.webContents.send('resAddnewTbl', data);
});

ipcMain.handle('home_btnUpdate', async (event, obj) => {
    await updateItem(obj).then(async(res)=> {
        let data = await readItem();
        mainWindow.webContents.send('resHomeTbl', data);

        if(res.status == "error"){
            showErrWin(res.message)
        }
    });
});

ipcMain.handle('addnew_btnUpdate', async (event, obj) => {
    await updateItem(obj).then(async(res)=> {
        let data = await readItem();
        mainWindow.webContents.send('resAddnewTbl', data);

        if(res.status == "error"){
            showErrWin(res.message)
        }
    });
});

ipcMain.handle('addnew_btnSave', async (event, obj) => {
    await writeItem(obj).then(async(res)=> {
        let data = await readItem();
        mainWindow.webContents.send('resAddnewTbl', data);

        if(res.status == "error"){
            showErrWin(res.message)
        }
    });
});

ipcMain.handle('addnew_btnDelete', async (event, obj) => {
    const options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 1,
        title: 'Confirm',
        message: 'Are you sure you want to delete?',
    };
    
    let response = dialog.showMessageBoxSync(mainWindow, options);
    if (response === 0) { // The 'Yes' button is clicked
        await deleteItem(obj).then(async(res)=> {
            let data = await readItem();
            mainWindow.webContents.send('resAddnewTbl', data);

            if(res.status == "error"){
                showErrWin(res.message)
            }
        });
    }
});

ipcMain.handle('changePass', async(event, obj) => {
    const { curUsername, curPassword, newPassword, rePassword } = obj;

    await updatePass(`${curUsername}${USERNAME_SUFFIX}`, curPassword, newPassword, rePassword).then((res) => {
        if(res.data == true){
            Menu.setApplicationMenu(null);
            mainWindow.webContents.send('state', "sub00");
            const options = {
                type: 'info',
                buttons: ['OK'],
                title: 'Success!',
                message: 'Password Changed!',
                message: 'Please login again.',
                alwaysOnTop: true,
            };
            dialog.showMessageBox(mainWindow, options);
        } else {
            showErrWin(res.message)
        }
    });
});

function writeCsv(data, filename) {
    // Convert all values of the format 'x / y' to a format Excel won't interpret as a date
    const formattedData = data.map(row => {
        for (let key in row) {
            if (typeof row[key] === 'string' && row[key].includes(' / ')) {
                row[key] = `'${row[key]}`;
            }
        }
        return row;
    });

    // Define the headers for the CSV
    const headers = Object.keys(formattedData[0]).map(key => ({ id: key, title: key }));

    const csvWriter = createCsvWriter({
        path: filename,
        header: headers
    });

    csvWriter
        .writeRecords(formattedData)
        .then(() => {
            const options = {
                type: 'info',
                buttons: ['OK'],
                title: 'Success!',
                message: 'The CSV file was written successfully!',
                alwaysOnTop: true,
            };
            dialog.showMessageBox(mainWindow, options);
        });
};

ipcMain.handle('reqCSV', async (event, obj) => {
    // Opens a dialog box for the user to select where to save the file
    const { filePath } = await dialog.showSaveDialog({
        title: "Save data as CSV",
        defaultPath: "output.csv",
        filters: [
            { name: 'CSV Files', extensions: ['csv'] }
        ]
    });

    if (!filePath) {
        console.log('File save was cancelled');
        return;
    }

    writeCsv(obj, filePath);
});