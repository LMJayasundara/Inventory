const { app, Menu, dialog } = require('electron');

class main_menu {
    constructor(mainWindow){
        const winMenu = [
            {
                label: 'Home',
                click: function () {
                    mainWindow.webContents.send('state', "sub11");
                }
            },
            
            {
                label: 'Add New',
                click: function () {
                    mainWindow.webContents.send('state', "sub21");
                }
            },
            {
                label: 'Setting',
                submenu: [
                    {
                        label: 'Change Password',
                        click: function () {
                            mainWindow.webContents.send('state', "sub31");
                        }
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        label: 'Relaod',
                        click: function () {
                            mainWindow.reload();
                            mainWindow.webContents.once('did-finish-load', () => {
                                mainWindow.webContents.send('version', app.getVersion());
                                mainWindow.webContents.send('state', 'sub11');
                            });
                        }
                    },
                    {
                        label: 'About',
                        click: function () {
                            mainWindow.webContents.send('state', "sub41");
                        }
                    },
                ]
            },
            {
                label: 'Logout',
                click: function () {
                    const options = {
                        type: 'question',
                        buttons: ['Yes', 'No'],
                        defaultId: 1,
                        title: 'Confirm',
                        message: 'Are you sure you want to logout?',
                    };
                    
                    let response = dialog.showMessageBoxSync(mainWindow, options);
                    if (response === 0) { // The 'Yes' button is clicked
                        Menu.setApplicationMenu(null);
                        mainWindow.webContents.send('state', "sub00");
                    }
                }
            },
            // {
            //     label: 'Developer',
            //     submenu: [
            //         { role: 'toggleDevTools' },
            //     ]
            // },
        ];

        return [ winMenu ];
    }
}

module.exports = main_menu;