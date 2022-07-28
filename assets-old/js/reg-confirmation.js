document.getElementById("uname").innerHTML = localStorage.getItem("username");
document.getElementById("umail").innerHTML = localStorage.getItem("email");

function redirect() {
    window.location.replace("otc-form-login.html")
}