/* Page helper methods*/
const emailIsValid = (email) => {
	"use strict";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const redirectToPage = function (relativeUrl) {
    window.location.assign(`${window.location.origin}/falcon${relativeUrl}`)
}

const setCookie = function (cname, cvalue) {
    document.cookie = `${cname}=${cvalue};path=/`
}

const getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const clearCookies = function () {
    setCookie('apiToken', '')
    setCookie('userData', '')
}

const checkCookie = function (cname) {
    let mCname = getCookie(`${cname}`);
    return mCname !== "";
}

/* Data helper methods */
const jsonStringToObject = function (text) {
    return JSON.parse(text)
}

function showProgress(spinnerIdentifier, hideElement) {
    $(`${spinnerIdentifier}`).css('display', '')
    $(`${hideElement}`).css('display', 'none')
}

function hideProgress(spinnerIdentifier, showElement) {
    $(`${spinnerIdentifier}`).css('display', 'none')
    $(`${showElement}`).css('display', '')
}

function setSessionTimeout() {
    // set automatic logout after specified timeout
    setTimeout(() => {
        clearCookies()
        window.location.assign(`${baseUrl}/mfi/index.php/auth/login`)
    }, 900000)
}

function alert(message, type = 'success', title = 'Success!') {
    swal(title, message, type);
}