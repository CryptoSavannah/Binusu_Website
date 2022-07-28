let psw1 = document.getElementById("psw1");
let psw2 = document.getElementById("psw2");
let error_div = document.getElementById("error9");
let error_msg = document.getElementById("err9");
let reset_btn = document.getElementById("reset-btn");
let loader = document.getElementById("loader");

function validate_input() {
    if (!(psw1.value) || !(psw2.value)) {
        error_div.style.display = 'block';
        error_msg.innerHTML = "Fill in all the fields";
    } else {
        error_msg.innerHTML = "";
        error_div.style.display = 'none';
        if (psw1.value !== psw1.value) {
            reset_btn.style.display = 'block';
            error_div.style.display = 'block';
            error_msg.innerHTML = "The two passwords do not match";
        } else {
            reset_btn.style.display = 'none';
            loader.style.display = "block";
            error_msg.innerHTML = "";
            error_div.style.display = 'none';
            new_password();
        }
    }
}

function new_password() {
    let psw = psw1.value;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var token = url.searchParams.get("token");

    let formdata = {
        "token": token,
        "new_password": psw
    }

    fetch(`${APIs()}/api/v1/binusu/confirm_reset`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formdata)
    }).then(res => res.json())
        .then(data => {
            loader.style.display = "none";

            if (data.status == 200) {
                window.location.replace("psw-reset-confirmation.html");
            } else {
                reset_btn.style.display = 'block';
                error_div.style.display = 'block';
                if (data.error == "Reset token already used") {
                    document.getElementById("req-btn").style.display = 'block'
                    error_msg.innerHTML = "Password reset link expired or already used. Send another request.";
                } else {
                    error_msg.innerHTML = data.error;
                }
            } 
        }).catch(
            e => {
                console.log(e)
                window.location.replace('404-error.html');
            }
        )
}