confirmOrder();

function confirmOrder() {
    let order_type = localStorage.getItem("order_type");
    let crypto_type = localStorage.getItem("crypto_type");
    let user_email = localStorage.getItem("user_email");
    let order_num = localStorage.getItem("order_number");

    document.getElementById("theorder").innerHTML = order_type.toUpperCase();
    document.getElementById("coinorder").innerHTML = crypto_type;
    document.getElementById("ordernumber").innerHTML = order_num;
    document.getElementById("usermail").innerHTML = user_email;

    window.localStorage.removeItem('order_type');
    window.localStorage.removeItem('crypto_type');
    window.localStorage.removeItem('order_amount');
    window.localStorage.removeItem('unit_price');
    window.localStorage.removeItem('order_amount_fiat');
}