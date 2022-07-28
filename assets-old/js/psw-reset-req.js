function validate_input() {
    if (!(document.getElementById("email_id").value)) {
        document.getElementById("error10").style.display = 'block';
        document.getElementById("err10").innerHTML = "Enter the Email Address associated to your Account";
    } else {
        document.getElementById("error10").style.display = 'none';
        document.getElementById("err10").innerHTML = "";
        document.getElementById("loader").style.display = "block";
        document.getElementById("reset_req").style.display = "none";
        document.getElementById("cancel").style.display = "none";
        reset_req();
    }
}

function reset_req() {
    let mail = document.getElementById("email_id").value;

    let formdata = {
        "email_address": mail
    }

    fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/password_reset`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formdata),
				})
					.then((res) => res.json())
					.then((data) => {
						document.getElementById("loader").style.display = "none";

						if (data.status == 200) {
							localStorage.setItem("u_email", mail);
							window.location.replace("check-email-pw-reset.html");
						} else {
							document.getElementById("error10").style.display = "block";
							document.getElementById("err10").innerHTML = data.error;

							document.getElementById("reset_req").style.display = "block";
							document.getElementById("cancel").style.display = "block";
						}
					})
					.catch((e) => {
						console.log(e);
						window.location.replace("404-error.html");
					});
}

