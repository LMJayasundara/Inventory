const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue, remove, update, get } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword, updatePassword } = require('firebase/auth');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkanEp7HdK_XYSDhxCHlBg--KiCRxREAg",
    authDomain: "inventory-management-7699b.firebaseapp.com",
    projectId: "inventory-management-7699b",
    storageBucket: "inventory-management-7699b.appspot.com",
    messagingSenderId: "307723656759",
    appId: "1:307723656759:web:ee65de406655fcd6dd29b2"
};

// Initialize Firebase
const fbapp = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(fbapp);
// Initialize Firebase Authentication
const auth = getAuth(fbapp);

function writeItem(obj) {
    return new Promise((resolve, reject) => {
        // Validate obj and its properties
        if (!obj || !obj.SKU || !obj.DES || !obj.PRICE || !obj.QUA || !obj.TYPE) {
            resolve({ status: "error", message: "Invalid data provided" });
            return;
        }

        // Reference to the item in Firebase
        const itemRef = ref(db, 'Items/' + obj.SKU);

        // Check if item already exists
        get(itemRef).then(snapshot => {
            if (snapshot.exists()) {
                resolve({ status: "error", message: "Item with this SKU already exists!" });
                return;
            }

            // If not exists, then set the new item
            set(itemRef, {
                SKU: obj.SKU,
                DES: obj.DES,
                PRICE: obj.PRICE,
                QUA: obj.QUA,
                SALE: "0",
                TYPE: obj.TYPE
            })
            .then(() => {
                resolve({ status: "success", message: "Data write succeeded"});
            })
            .catch((error) => {
                resolve({ status: "error", message: error.message});
            });
        }).catch((error) => {
            resolve({ status: "error", message: "Error checking item existence: " + error.message});
        });
    })
};

function updateItem(obj) {
    return new Promise((resolve, reject) => {
        // Create a new object for updating in Firebase
        const itemToUpdate = {
            SKU: obj.SKU,
            DES: obj.DES,
            PRICE: obj.PRICE,
            TYPE: obj.TYPE
        };

        // Add QUA or SALE to the itemToUpdate object if they exist
        if (obj.QUA) {
            itemToUpdate.QUA = obj.QUA;
        }

        if (obj.SALE) {
            itemToUpdate.SALE = obj.SALE;
        }

        // Update in Firebase
        update(ref(db, 'Items/' + obj.SKU), itemToUpdate)
            .then(() => {
                resolve({ status: "success", message: "Data update succeeded" });
            })
            .catch((error) => {
                resolve({ status: "error", message: error.message });
            });
    })
};

function deleteItem(obj) {
    return new Promise((resolve, reject) => {
        // Validate obj and its properties
        if (!obj || !obj.SKU) {
            resolve({ status: "error", message: "Invalid data provided" });
            return;
        }
        const itemRef = ref(db, 'Items/' + obj.SKU);
        remove(itemRef)
            .then(() => {
                console.log('Item deleted successfully');
                resolve({ status: "success", message: "Iten remove succeeded"});
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
                resolve({ status: "error", message: error.message});
            });
    });    
};

function readItem(SKU) {
    return new Promise((resolve, reject) => {
        let dataRef;

        // If SKU is provided, read data for that user
        if (SKU) {
            dataRef = ref(db, 'Items/' + SKU);
        } 
        // If no SKU is provided, read data for all users
        else {
            dataRef = ref(db, 'Items');
        }
    
        onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve({ status: "success", message: "Data read succeeded", data: data });
            } else {
                resolve({ status: "error", message: "No data available", data: null });
                return;
            }
        }, (error) => {
            resolve({ status: "error", message: error.message, data: null });
            return;
        });
    });
};


function login(email, password){
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            resolve({ status: "success", message: "Login succeeded", data: userCredential.user !== null });
        })
        .catch(error => {
            let customMessage;
            switch (error.code) {
                case 'auth/user-not-found':
                    customMessage = "User not found.";
                    break;
                case 'auth/wrong-password':
                    customMessage = "Incorrect password.";
                    break;
                case 'auth/user-disabled':
                    customMessage = "This account has been disabled.";
                    break;
                case 'auth/network-request-failed':
                    customMessage = "No connection.";
                    break;
                default:
                    customMessage = "An unknown error occurred. Please try again.";
            }

            resolve({ status: "error", message: customMessage, data: false });
            return;
        });
    })
};

function updatePass(curUsername, curPassword, newPassword, rePassword){
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, curUsername, curPassword)
            .then(userCredential => {
                // User is now signed in
                const user = userCredential.user;

                // Now change the password
                updatePassword(user, rePassword).then(() => {
                    resolve({ status: "success", message: "Password updated successfully!", data: true });
                }).catch(error => {
                    resolve({ status: "error", message: "Error updating password", data: false });
                });

            }).catch(error => {
                resolve({ status: "error", message: "Error updating password", data: false });
            });
    })
}

module.exports = {
    login,
    readItem,
    writeItem,
    updateItem,
    deleteItem,
    updatePass,
};