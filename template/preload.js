const { ipcRenderer } = require('electron');
let addnewTbl, homeTbl = null;
let selectedRow, home_selectedRow = null;

window.onload = function () {
    ipcRenderer.invoke("reqHomeTbl");
    addnewTbl = document.getElementById("addnewTbl");
    homeTbl = document.getElementById("homeTbl");
};

function clearHomeForm() {
    document.getElementById("home_SKU").value = '';
    document.getElementById("home_DES").value = '';
    document.getElementById("home_PRICE").value = '';
    document.getElementById("home_QUA").value = '';
    document.getElementById("home_TYPE").value = '';
};

function clearAddNewForm() {
    document.getElementById("addnew_SKU").value = '';
    document.getElementById("addnew_DES").value = '';
    document.getElementById("addnew_PRICE").value = '';
    document.getElementById("addnew_QUA").value = '';
    document.getElementById("addnew_TYPE").value = '';
};

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var username = document.getElementById("InputName");
    var password = document.getElementById("InputPassword");
    const obj = { username: username.value, password: password.value };
    ipcRenderer.invoke("login", obj);
    username.value = '';
    password.value = '';
    console.log(obj);
});

// Update an item
const home_btnUpdate = document.getElementById('home_btnUpdate');
home_btnUpdate.addEventListener('click', function (e) {
    e.preventDefault();
    var home_SKU = document.getElementById("home_SKU");
    var home_DES = document.getElementById("home_DES");
    var home_PRICE = document.getElementById("home_PRICE");
    var home_QUA = document.getElementById("home_QUA");
    var home_TYPE = document.getElementById("home_TYPE");
    const obj = { SKU: home_SKU.value, DES: home_DES.value, PRICE: home_PRICE.value, SALE: home_QUA.value, TYPE: home_TYPE.value };
    ipcRenderer.invoke("home_btnUpdate", obj);
    clearHomeForm();
    // console.log(obj);
});

// Clear an home form
const home_btnClear = document.getElementById('home_btnClear');
home_btnClear.addEventListener('click', function (e) {
    e.preventDefault();
    home_selectedRow.style.backgroundColor = '';
    clearHomeForm();
});

////////////////////////////////////////////////////////////////////////////////////////////////////

// Save new item
const addnew_btnSave = document.getElementById('addnew_btnSave');
addnew_btnSave.addEventListener('click', function (e) {
    e.preventDefault();
    var addnew_SKU = document.getElementById("addnew_SKU");
    var addnew_DES = document.getElementById("addnew_DES");
    var addnew_PRICE = document.getElementById("addnew_PRICE");
    var addnew_QUA = document.getElementById("addnew_QUA");
    var addnew_TYPE = document.getElementById("addnew_TYPE");
    const obj = { SKU: addnew_SKU.value, DES: addnew_DES.value, PRICE: addnew_PRICE.value, QUA: addnew_QUA.value, TYPE: addnew_TYPE.value };
    ipcRenderer.invoke("addnew_btnSave", obj);
    clearAddNewForm();
    // console.log(obj);
});

const addnew_btnUpdate = document.getElementById('addnew_btnUpdate');
addnew_btnUpdate.addEventListener('click', function (e) {
    e.preventDefault();
    var addnew_SKU = document.getElementById("addnew_SKU");
    var addnew_DES = document.getElementById("addnew_DES");
    var addnew_PRICE = document.getElementById("addnew_PRICE");
    var addnew_QUA = document.getElementById("addnew_QUA");
    var addnew_TYPE = document.getElementById("addnew_TYPE");
    const obj = { SKU: addnew_SKU.value, DES: addnew_DES.value, PRICE: addnew_PRICE.value, QUA: addnew_QUA.value, TYPE: addnew_TYPE.value };
    ipcRenderer.invoke("addnew_btnUpdate", obj);
    clearAddNewForm();
    // console.log(obj);
});

// Delete an item
const addnew_btnDelete = document.getElementById('addnew_btnDelete');
addnew_btnDelete.addEventListener('click', function (e) {
    e.preventDefault();
    var addnew_SKU = document.getElementById("addnew_SKU");
    const obj = { SKU: addnew_SKU.value };
    ipcRenderer.invoke("addnew_btnDelete", obj);
    clearAddNewForm();
    // console.log(obj);
});

// Clear an addnew form
const addnew_btnClear = document.getElementById('addnew_btnClear');
addnew_btnClear.addEventListener('click', function (e) {
    e.preventDefault();
    selectedRow.style.backgroundColor = '';
    clearAddNewForm();
});

ipcRenderer.on('resHomeTbl', (event, results) => {
    let home_tbl = "";
    const list = Object.values(results.data);
    list.forEach(element => {
        home_tbl += `
            <tr>
            <tr>
                <td class="no-wrap">${element.SKU}</td>
                <td class="no-wrap">${element.DES}</td>
                <td class="no-wrap">${element.PRICE}</td>
                <td class="no-wrap">${element.SALE} / ${element.QUA}</td>
                <td class="no-wrap">${element.TYPE}</td>
            </tr>
            </tr>
        `;
    });

    homeTbl.innerHTML = home_tbl;
});

// Capture the input element
const homeTblsearchInput = document.getElementById('homeTbl-search-input');

homeTblsearchInput.addEventListener('keyup', function() {
    // Get the search term (convert it to lowercase for a case-insensitive search)
    let searchTerm = homeTblsearchInput.value.toLowerCase();

    // Capture all the rows of the table
    let rows = document.querySelectorAll('#homeTbl tr');

    // Loop through each row
    rows.forEach(row => {
        // Assume the row doesn't contain the search term
        let containsTerm = false;

        // Get all cells in the row
        let cells = row.querySelectorAll('td');

        // Loop through each cell
        cells.forEach(cell => {
            // If the cell's text contains the search term, set containsTerm to true
            if (cell.textContent.toLowerCase().indexOf(searchTerm) > -1) {
                containsTerm = true;
            }
        });

        // If containsTerm is true, show the row, otherwise hide it
        row.style.display = containsTerm ? '' : 'none';
    });
});

const home_fetchtbl = document.getElementById("home_fetchtbl");
home_fetchtbl.addEventListener('click', event => {
    let targetElement = event.target;
    while (targetElement && targetElement.tagName !== 'TR') {
        targetElement = targetElement.parentNode;
    }
    if (targetElement && targetElement.parentNode.tagName === 'TBODY') {
        // if there is a previously selected row, reset its background
        if (home_selectedRow) {
            home_selectedRow.style.backgroundColor = '';
        }
        // set the background of the clicked row
        targetElement.style.backgroundColor = 'skyblue';
        // store the selected row
        home_selectedRow = targetElement;
        document.getElementById("home_SKU").value = targetElement.cells[0].innerHTML;
        document.getElementById("home_DES").value = targetElement.cells[1].innerHTML;
        document.getElementById("home_PRICE").value = targetElement.cells[2].innerHTML;
        document.getElementById("home_QUA").value = targetElement.cells[3].innerHTML.split(' / ')[0];
        document.getElementById("home_TYPE").value = targetElement.cells[4].innerHTML;
    }
});

ipcRenderer.on('resAddnewTbl', (event, results) => {
    let addnew_tbl = "";
    const list = Object.values(results.data);
    list.forEach(element => {
        addnew_tbl += `
            <tr>
            <tr>
                <td class="no-wrap">${element.SKU}</td>
                <td class="no-wrap">${element.DES}</td>
                <td class="no-wrap">${element.PRICE}</td>
                <td class="no-wrap">${element.QUA}</td>
                <td class="no-wrap">${element.TYPE}</td>
            </tr>
            </tr>
        `;
    });

    addnewTbl.innerHTML = addnew_tbl;
});

// Capture the input element
const addnewTblsearchInput = document.getElementById('addnewTbl-search-input');

addnewTblsearchInput.addEventListener('keyup', function() {
    // Get the search term (convert it to lowercase for a case-insensitive search)
    let searchTerm = addnewTblsearchInput.value.toLowerCase();

    // Capture all the rows of the table
    let rows = document.querySelectorAll('#addnewTbl tr');

    // Loop through each row
    rows.forEach(row => {
        // Assume the row doesn't contain the search term
        let containsTerm = false;

        // Get all cells in the row
        let cells = row.querySelectorAll('td');

        // Loop through each cell
        cells.forEach(cell => {
            // If the cell's text contains the search term, set containsTerm to true
            if (cell.textContent.toLowerCase().indexOf(searchTerm) > -1) {
                containsTerm = true;
            }
        });

        // If containsTerm is true, show the row, otherwise hide it
        row.style.display = containsTerm ? '' : 'none';
    });
});

const addnew_fetchtbl = document.getElementById("addnew_fetchtbl");
addnew_fetchtbl.addEventListener('click', event => {
    let targetElement = event.target;
    while (targetElement && targetElement.tagName !== 'TR') {
        targetElement = targetElement.parentNode;
    }
    if (targetElement && targetElement.parentNode.tagName === 'TBODY') {
        // if there is a previously selected row, reset its background
        if (selectedRow) {
            selectedRow.style.backgroundColor = '';
        }
        // set the background of the clicked row
        targetElement.style.backgroundColor = 'skyblue';
        // store the selected row
        selectedRow = targetElement;
        document.getElementById("addnew_SKU").value = targetElement.cells[0].innerHTML;
        document.getElementById("addnew_DES").value = targetElement.cells[1].innerHTML;
        document.getElementById("addnew_PRICE").value = targetElement.cells[2].innerHTML;
        document.getElementById("addnew_QUA").value = targetElement.cells[3].innerHTML;
        document.getElementById("addnew_TYPE").value = targetElement.cells[4].innerHTML;
    }
});

function hideall() {
    document.getElementById('login_container').style.display = 'none';
    document.getElementById('home_container').style.display = 'none';
    document.getElementById('addnew_container').style.display = 'none';
    document.getElementById('about_container').style.display = 'none';
    document.getElementById('settings_container').style.display = 'none';
};

ipcRenderer.on("state", (event, sts) => {
    if (sts == 'sub00') {
        hideall();
        document.body.style.background = null;
        document.getElementById('login_container').style.display = 'block';
    } else if (sts == 'sub11') {
        hideall();
        document.body.style.background = "none";
        ipcRenderer.invoke("reqHomeTbl");
        document.getElementById('home_container').style.display = 'block';
    } else if (sts == 'sub21') {
        hideall();
        document.body.style.background = "none";
        ipcRenderer.invoke("reqAddnewTbl");
        document.getElementById('addnew_container').style.display = 'block';
    } else if (sts == 'sub31') {
        hideall();
        document.body.style.background = "none";
        document.getElementById('settings_container').style.display = 'block';
    } else if (sts == 'sub41') {
        hideall();
        document.body.style.background = "none";
        document.getElementById('about_container').style.display = 'block';
    }
});

ipcRenderer.on('version', (event, results) => {
    document.getElementById('Vno').innerHTML = results;
});

/////////////////////////////////// Change Pass ///////////////////////////////////

function validatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const retypePassword = document.getElementById('retypePassword').value;

    const passwordError = document.getElementById('passwordError');
    const retypeError = document.getElementById('retypeError');

    // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // if(!passwordRegex.test(newPassword)) {
    //     // passwordError.textContent = 'Password should be minimum 8 characters, include at least 1 uppercase letter and 1 number';
    //     passwordError.textContent = 'Invalid Password Type!';
    // } else {
    //     passwordError.textContent = '';
    // }

    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        passwordError.textContent = 'Password should be a minimum of 6 characters!';
    } else {
        passwordError.textContent = '';
    }

    if(newPassword !== retypePassword) {
        retypeError.textContent = 'Passwords do not match';
    } else {
        retypeError.textContent = '';
    }
};

const changePass = document.getElementById('changePass');
changePass.addEventListener('click', function (e) {
    e.preventDefault();
    var curUsername = document.getElementById("username");
    var curPassword = document.getElementById("currentPassword");
    var newPassword = document.getElementById("newPassword");
    var rePassword = document.getElementById("retypePassword");

    const passwordError = document.getElementById('passwordError');
    const retypeError = document.getElementById('retypeError');

    if(passwordError.textContent || retypeError.textContent) {
        ipcRenderer.invoke('error', "Please correct the errors");
    } else{
        const obj = { 
            curUsername: curUsername.value, 
            curPassword: curPassword.value,
            newPassword: newPassword.value,
            rePassword: rePassword.value,
        };
        ipcRenderer.invoke("changePass", obj);
        curUsername.value = '';
        curPassword.value = '';
        newPassword.value = '';
        rePassword.value = '';
    }
});


const home_btnDownload = document.getElementById('home_btnDownload');
home_btnDownload.addEventListener('click', async function (e) {
    e.preventDefault();

    const fetchdowntbl = document.getElementById('home_fetchtbl');
    let data = [];

    // We'll assume that the table header names exactly match the property names in your objects
    let headers = Array.from(fetchdowntbl.rows[0].cells).map(cell => cell.innerText);

    // Loop over each row, skipping the header
    for (let i = 1; i < fetchdowntbl.rows.length; i++) {
        let row = fetchdowntbl.rows[i];
    
        // Check if the row is displayed
        if (row.style.display !== 'none') {
            let rowData = {};
    
            // Loop over each cell in the row
            for (let j = 0; j < row.cells.length; j++) {
                let cell = row.cells[j];
    
                // Set the property name to be the corresponding header name and the value to be the cell text
                rowData[headers[j]] = cell.innerText;
            }
    
            // Only add rowData to data if it is not an empty object
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        }
    }

    if(data.length > 0){
        await ipcRenderer.invoke('reqCSV', data);
    }
})