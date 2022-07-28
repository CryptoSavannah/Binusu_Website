document.addEventListener("DOMContentLoaded", function () {
    let cryptoB = document.getElementById("coins-exchange");
    let ugxB = document.getElementById("money-xchange");

    let cryptoS = document.getElementById("coins-exchanges");
    let ugxS = document.getElementById("money-xchanges");

    let crypto_type1 = document.getElementById("dcoin-exchange");

    let order_type1 = document.getElementById("money-exchange");
 

    let text = "Enter an amount to Exchange here..";

    let exchangeBigScreen = document.getElementById("exchangeBtn");

    exchangeBigScreen.addEventListener("click", () => {
        window.localStorage.removeItem('total_fee');
        window.localStorage.removeItem('network_fee');
        window.localStorage.removeItem('order_type');
        window.localStorage.removeItem('crypto_type');
        window.localStorage.removeItem('order_amount');
        window.localStorage.removeItem('order_amount_fiat');
        const userId = getCookie('access_token');

        if (order_type1.value == "buy") {
            if (cryptoB.value == "" || ugxB.value == "") {
                ugxB.placeholder = text;
            } else {
                let networkfee = document.getElementById("networkFee").innerHTML;
                let total_amount = (1 * networkfee) + (1 * ugxB.value);

                localStorage.setItem("total_amount", total_amount);
                localStorage.setItem("network_fee", networkfee);
                localStorage.setItem("order_amount_fiat", ugxB.value);
                localStorage.setItem("order_amount", cryptoB.value);
                localStorage.setItem("crypto_type", crypto_type1.value);
                localStorage.setItem("order_type", order_type1.value);
                localStorage.setItem("fees_type", "MEDIUM")

                if (!userId) {
                    window.location.replace("otc-form-login.html");
                } else {
                    window.location.replace("order.html");
                }
            }
        } else if (order_type1.value == "sell") {

            if (cryptoS.value == "" || ugxS.value == "") {
                cryptoS.placeholder = text;
            } else {
                let networkfee = document.getElementById("networkFee").innerHTML;
                localStorage.setItem("network_fee", networkfee.value);
                localStorage.setItem("order_amount_fiat", ugxS.value);
                localStorage.setItem("order_amount", cryptoS.value);
                localStorage.setItem("crypto_type", crypto_type1.value);
                localStorage.setItem("order_type", order_type1.value);
                if (!userId) {
                    // if (location.href == "https://binusu.com/index.html" || location.href == "https://binusu.com/") {
                    window.location.replace("otc-form-login.html");
                } else {
                    window.location.replace("order.html");
                }
            }
        } else {
            console.log("Something went wrong")
        }
    }
    )
})