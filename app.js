
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getAuth , onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyDA10atWSkGuAu1k7Ezx9LRxjvLu_X92WE",
    authDomain: "liveweaver-e6ebe.firebaseapp.com",
    projectId: "liveweaver-e6ebe",
    storageBucket: "liveweaver-e6ebe.firebasestorage.app",
    messagingSenderId: "226590483250",
    appId: "1:226590483250:web:4446ec8f9043c707a36d2b",
    measurementId: "G-PPRYS6NFBN"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth =getAuth(app);
  
  const createUserAccount = ()=>{
  createUserWithEmailAndPassword(auth, signup_email.value, signup_password.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("user=>",user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });}

  
  
  
  const userLogin = ()=>{
  signInWithEmailAndPassword(auth, signin_email.value, signin_password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("user");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });}
  
  const logout = ()=>{
    signOut(auth).then(() => {
    }).catch((error) => {
    });
}


  const signup_email = document.getElementById('signup_email');
  const signup_password = document.getElementById('signup_password');
  const signup_btn = document.getElementById('signup_btn');
  
  const signin_email = document.getElementById('signin_email');
  const signin_password = document.getElementById('signin_password');
  const signin_btn = document.getElementById('signin_btn');

  const user_email = document.getElementById('user_email');
  const logout_btn = document.getElementById('logout_btn');

  const auth_container = document.getElementById('auth_container');
  const user_container = document.getElementById('user_container');
  
  
  signup_btn.addEventListener('click',createUserAccount);
  signin_btn.addEventListener('click',userLogin);
  logout_btn.addEventListener('click',logout);


  onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    auth_container.style.display = "none";
    user_container.style.display = "block";
    user_email.innerText = user.email;

    //...
  } else {
    console.log('user not logged in');
    auth_container.style.display = "block";
    user_container.style.display = "none";
  }
  });
  


