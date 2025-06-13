
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

  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);


    //sessionStorage
    sessionStorage.setItem("authType", "signup"); // on signup
    sessionStorage.setItem("authType", "login");  // on login
  
    // DOM Elements
    const signup_email = document.getElementById('signup_email');
    const signup_password = document.getElementById('signup_password');
    const signup_btn = document.getElementById('signup_btn');
    
    const signin_email = document.getElementById('signin_email');
    const signin_password = document.getElementById('signin_password');
    const signin_btn = document.getElementById('signin_btn');

    // Signup Handler
    const createUserAccount = (e) => {
      e.preventDefault();
      createUserWithEmailAndPassword(auth, signup_email.value, signup_password.value)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Signup success:", user.uid);
          sessionStorage.setItem("authType", "signup");
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          alert("Signup failed: " + error.message);
        });
    };

    // Login Handler
    const userLogin = (e) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, signin_email.value, signin_password.value)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Login success:", user.uid);
          sessionStorage.setItem("authType", "login");
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          alert("Login failed: " + error.message);
        });
    };

    // Toggle login/signup form
    window.toggleForm = function toggleForm() {
      const signin = document.getElementById('signin_container');
      const signup = document.getElementById('signup_container');
      if (signin.style.display === "none") {
        signin.style.display = "block";
        signup.style.display = "none";
      } else {
        signin.style.display = "none";
        signup.style.display = "block";
      }
    };

    // Attach event listeners
    signup_btn.addEventListener("click", createUserAccount);
    signin_btn.addEventListener("click", userLogin);

    // Optional: Redirect if already logged in
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "dashboard.html";
      }
    });

