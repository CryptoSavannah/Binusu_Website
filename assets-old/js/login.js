document.addEventListener("DOMContentLoaded", function () {
	let err7 = document.querySelector("#err7");
	let error_div = document.querySelector("#error7");
	let pg_loader = document.querySelector("#loader");
	let forgot_ps = document.querySelector("#forgot-ps");
	let login_btn = document.querySelector("#login");
	let register_btn = document.querySelector("#register-btn");
	let usermail = document.querySelector("#user_email");
	let userpsw = document.querySelector("#user_psw");

	login_btn.addEventListener("click", () => {
		let user_email = document.querySelector("#user_email").value;
		let password = document.querySelector("#user_psw").value;

		if (!user_email || !password) {
			err7.innerHTML = "Please fill in all the fields";
			error_div.style.display = "block";
		} else if (!emailIsValid(user_email)) {
			err7.innerHTML = "Enter your valid email address";
			error_div.style.display = "block";
		} else {
			err7.innerHTML = "";
			error_div.style.display = "none";
			pg_loader.style.display = "block";
			forgot_ps.style.display = "none";
			login_btn.style.display = "none";
			register_btn.style.display = "none";
			usermail.disabled = true;
			userpsw.disabled = true;
			login();
		}
	});

	function login() {
		let user_email = usermail.value;
		let password = userpsw.value;
		let formdata = {
			email_address: user_email,
			password: password,
		};
		//mc1.cryptosavannah.com

		fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/verify_kyc`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formdata),
		})
			.then((res) => res.json())
			.then((data) => {
				pg_loader.style.display = "none";

				if (data.status == 200) {
					forgot_ps.style.display = "none";
					login_btn.style.display = "none";
					register_btn.style.display = "none";

					err7.innerHTML = "";
					error_div.style.display = "none";

					setCookie("access_token", `${data.data.id}`);
					setCookie("userData", `${data.data.email_address}`);
					setCookie("fiat_type", "UGX");

					// window.localStorage.setItem("access_token", data.data.id);
					// window.localStorage.setItem("user_email", data.data.email_address);

					window.location.replace("index.html");
				} else {
					forgot_ps.style.display = "block";
					login_btn.style.display = "block";
					register_btn.style.display = "block";
					error_div.style.display = "block";

					usermail.disabled = false;
					userpsw.disabled = false;

					if (data.error == "User with email not found") {
						err7.innerHTML =
							"No account found for " + usermail.value + ". Register to continue";
					} else {
						err7.innerHTML = "Invalid Email ID or Password";
					}
				}
			})
			.catch((e) => {
				console.log(e);
				window.location.replace("404-error.html");
			});
	}
});

404 page not found