function toggleForm() {
    const signin_container = document.getElementById('signin_container');
    const signup_container = document.getElementById('signup_container');
    
    if (signin_container.style.display === "none") {
      signin_container.style.display = "block";
      signup_container.style.display = "none";
    } else {
      signin_container.style.display = "none";
      signup_container.style.display = "block";
    }
  }