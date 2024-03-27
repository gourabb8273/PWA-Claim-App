
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import {collection, getDocs, addDoc, getFirestore, doc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDzJyjbJb3SYB5GlkqmFyQUvOZfVKunxEA",
    authDomain: "pwa-claim-app.firebaseapp.com",
    projectId: "pwa-claim-app",
    storageBucket: "pwa-claim-app.appspot.com",
    messagingSenderId: "1084618304397",
    appId: "1:1084618304397:web:f61d2e89118a5079c42bc4",
    measurementId: "G-E5V8SR8VVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


// Register Service worker 
const registerServiceWorker = async () => {
    const register = navigator.serviceWorker.register("../sw.js")
    return register;
}
registerServiceWorker();

const signupForm = document.getElementById("sign-up-form");
const signupFormAdmin = document.getElementById("sign-up-form-admin");
const adminSignupButton = document.getElementById("admin-signup");
const nonAdminSignupButton = document.getElementById("signup");
const adminLoginButton = document.getElementById("admin-login");
const nonAdminLoginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const loginFormAdmin = document.getElementById("login-form-admin");
const loginForm = document.getElementById("login-form");
const claimForm = document.getElementById('claim-form');
const viewClaim = document.getElementById('claim-data');
const claimButton = document.getElementById('claim-button');
const viewClaimButton = document.getElementById('view-claim-button');


adminSignupButton.addEventListener("click",function(e){
    e.preventDefault();
    signupFormAdmin.style.display = "block"
    signupForm.style.display = "none"
    loginFormAdmin.style.display = "none"
    loginForm.style.display = "none"
})

nonAdminSignupButton.addEventListener("click",function(e){
    e.preventDefault();
    signupForm.style.display = "block"
    signupFormAdmin.style.display = "none"
    loginFormAdmin.style.display = "none"
    loginForm.style.display = "none"
})


adminLoginButton.addEventListener("click",function(e){
    e.preventDefault();
    loginFormAdmin.style.display = "block"
    signupForm.style.display = "none"
    signupFormAdmin.style.display = "none"
    loginForm.style.display = "none"
})

nonAdminLoginButton.addEventListener("click",function(e){
    e.preventDefault();
    loginForm.style.display = "block"
    loginFormAdmin.style.display = "none"
    signupForm.style.display = "none"
    signupFormAdmin.style.display = "none"
})


logoutButton.addEventListener("click", function(e){
    e.preventDefault();
    adminLoginButton.style.display = "block";
    nonAdminLoginButton.style.display = "block";
    adminSignupButton.style.display = "block";
    nonAdminSignupButton.style.display = "block";
    claimButton.style.display ='none'
    viewClaimButton.style.display ='none'
    logoutButton.style.display = 'none'
    document.getElementById("user-profile").textContent = 'Profile';

})

claimButton.addEventListener("click",function(e){
    e.preventDefault();
    claimForm.style.display = 'block'
})

// Registration using firebase authentication for non-admin user
signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const name = document.getElementById("signup-name").value;
    const password = document.getElementById("signup-password").value;
    if (!(email && password && name)) {
        alert("please enter email and password");
        return
    }
    const userData = {
        name,
        email,
        date: new Date(),
        isAdmin: false
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {

            // Adding the user and role in the db 
            const ref = collection(db, "users");
            const userRecord = await addDoc(ref,userData);
            console.log("user")
            alert("Admin Signup was successful")
            document.getElementById("signup-email").value="";
            document.getElementById("signup-name").value="";
            document.getElementById("signup-password").value="";
            document.getElementById("user-profile").textContent = name;
            signupForm.style.display = "none";
            adminLoginButton.style.display = "none";
            nonAdminLoginButton.style.display = "none";
            logoutButton.style.display = "block";
            claimButton.style.display ="block";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });

})

// Registration using firebase authentication for admin user
signupFormAdmin.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("signup-email-admin").value;
    const name = document.getElementById("signup-name-admin").value;
    const password = document.getElementById("signup-password-admin").value;
    if (!(email && password && name)) {
        alert("please enter email and password");
        return
    }
    const userData = {
        name,
        email,
        date: new Date(),
        isAdmin: true
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {

            // Adding the user and role in the db 
            const ref = collection(db, "users");
            const userRecord = await addDoc(ref,userData);
            console.log("user")
            alert("Signup was successful")
            document.getElementById("signup-email-admin").value = '';
            document.getElementById("signup-name-admin").value= '';
            document.getElementById("signup-password-admin").value = '';
            document.getElementById("user-profile").textContent = `${email} (Admin)`;;
            signupFormAdmin.style.display = "none";
            adminLoginButton.style.display = "none";
            nonAdminLoginButton.style.display = "none";
            logoutButton.style.display = "block";
            viewClaimButtonutton.style.display ="block";

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });

})



// Login using firebase authentication for non-admin user
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    if (!(email && password)) {
        alert("please enter email and password");
        return
    }
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            alert("User login was successful")
            document.getElementById("signup-email").value="";
            document.getElementById("signup-name").value="";
            document.getElementById("signup-password").value="";
            document.getElementById("user-profile").textContent = email;
            loginForm.style.display = "none";
            adminLoginButton.style.display = "none";
            nonAdminLoginButton.style.display = "none";
            adminSignupButton.style.display = "none";
            nonAdminSignupButton.style.display = "none";
            logoutButton.style.display = "block";
            claimButton.style.display ="block";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });

})

// Login using firebase authentication for non-admin user
loginFormAdmin.addEventListener("submit", async function (e) {
    e.preventDefault();
    debugger
    const email = document.getElementById("login-email-admin").value;
    const password = document.getElementById("login-password-admin").value;
    if (!(email && password)) {
        alert("please enter email and password");
        return
    }
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            alert("Admin Login was successful")
            document.getElementById("signup-email").value="";
            document.getElementById("signup-name").value="";
            document.getElementById("signup-password").value="";
            document.getElementById("user-profile").textContent = `${email} (Admin)`;
            loginFormAdmin.style.display = "none";
            adminLoginButton.style.display = "none";
            nonAdminLoginButton.style.display = "none";
            adminSignupButton.style.display = "none";
            nonAdminSignupButton.style.display = "none";
            logoutButton.style.display = "block";
            viewClaimButton.style.display ="block";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });

})

claimForm.addEventListener("submit",async function(e){
    e.preventDefault();
    const amount = document.getElementById("claim-amount").value;
    const description = document.getElementById("claim-description").value;

    const ref = collection(db, "claims");
    const claimData = {
        amount,
        description,
        date: new Date(),
        email: "gourab@gmail.com"
    }
    const result = await addDoc(ref, claimData);
    alert("Claim has been added");
    document.getElementById("claim-amount").value = '';
    document.getElementById("claim-description").value = '';
})



viewClaimButton.addEventListener("click",async function(e){
    e.preventDefault();

    debugger
    const claimData = document.getElementById('claim-data');
    const table =  document.createElement('table');
    const headingRow = document.createElement('th');
    headingRow.innerHTML = `
    <th>Claim Amount</th>
    <th>Claim Description</th>
    `
    table.appendChild(headingRow)


    const ref = collection(db, "claims");
    const data = await getDocs(ref);
    data.forEach(d=>{
        const data = d.data();
        const row = document.createElement('tr');
        const cells =[
            document.createElement('td'),
            document.createElement('td')
        ]
        cells[0].textContent = data.amount
        cells[1].textContent = data.description
    
        cells.forEach(i => row.appendChild(i))
        table.appendChild(row)
    })
 
    claimData.append(table)
})


