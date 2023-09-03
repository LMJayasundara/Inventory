//////////////////////////////// start config ////////////////////////////////

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBkanEp7HdK_XYSDhxCHlBg--KiCRxREAg",
//   authDomain: "inventory-management-7699b.firebaseapp.com",
//   projectId: "inventory-management-7699b",
//   storageBucket: "inventory-management-7699b.appspot.com",
//   messagingSenderId: "307723656759",
//   appId: "1:307723656759:web:ee65de406655fcd6dd29b2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

//////////////////////////////// end config ////////////////////////////////

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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
const app = initializeApp(firebaseConfig);
// Initialize Firebase Realtime Database
const db = getDatabase(app);
// Initialize Firebase Authentication
const auth = getAuth(app);

const obj = { "Name": "shan", "Age": 26 };

function writeUserData(userId, name, email) {
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
    });
};

writeUserData(456, "shanx", "test@gmail.com");

function readUserData(userId) {
    const userRef = ref(db, 'users/' + userId);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data);
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error("Error reading data:", error);
    });
};

function readAllUsersData() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data);
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error("Error reading data:", error);
    });
};

function readData(userId) {
    let dataRef;

    // If userId is provided, read data for that user
    if (userId) {
        dataRef = ref(db, 'users/' + userId);
    } 
    // If no userId is provided, read data for all users
    else {
        dataRef = ref(db, 'users');
    }

    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data);
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error("Error reading data:", error);
    });
}


// readData()

function login(){
    const email = "admin@inventory.com";
    const password = "admin123";
  
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Handle the login success here
            console.log('Logged in', userCredential.user !== null);
        })
        .catch(error => {
            // Handle the login error here
            console.error('Login Error', error.message);
        });
};

login()