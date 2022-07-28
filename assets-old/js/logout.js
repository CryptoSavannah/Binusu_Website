// // function logout() {
// //     setCookie('access_token', '')
// //     window.location.replace("index.html");
// }

$(document).ready(function() {
    const logOutBigScreen = document.getElementById("logout-bigscreen")
    const logOutSmallScreen = document.getElementById("logout-smallScreen")

    logOutBigScreen.addEventListener("click", () => {
        setCookie('access_token', '')
        window.location.replace("index.html");
    })
})