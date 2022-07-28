document.addEventListener("DOMContentLoaded", function () {
	function startTimer(duration, display) {
		let timer = duration,
			minutes,
			seconds;
		setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = " " + "(" + minutes + ":" + seconds + ")";

			if (--timer === 0) {
				display.textContent = "";

				localStorage.setItem("expired", "yes");
				window.location.reload();
				return;
			}
		}, 1000);
	}

	//LEAVE PAGE EXPIRED
	expiredStatus = localStorage.getItem("expired");
	if (expiredStatus === "no" || expiredStatus === "") {
		//TIMER CONTROLS
		let minute = 60 * 1,
			display = document.querySelector("#timer");
		startTimer(minute, display);
	} else if (expiredStatus === "yes") {
		document.querySelector("#confirm").disabled = true;
		document.querySelector("#confirm").textContent = "ORDER EXPIRED";
		document.querySelector("#confirm").style.background = "grey";
		// document.querySelector("#confirm").style.display = "none"
		document.querySelector("#confirm").style.pointerEvents = "none";
	}

	let input = document.getElementById("range");
	input.onclick = function (e) {
		let currentValue = e.target.value;
		if (currentValue <= 35) {
			// the_fees = localStorage.getItem("network_fee_low");
			savedCrypto = localStorage.getItem("savedCrypto");
			fee = JSON.parse(savedCrypto)["SLOW"];
			localStorage.setItem("network_fee", fee);
			total = parseInt(localStorage.getItem("order_amount_fiat")) + parseInt(fee);
			localStorage.setItem("total_amount", total);
			localStorage.setItem("fees_type", "SLOW");
			document.getElementById("network_fees").value =
				parseInt(fee).toLocaleString("en-US") + " " + "UGX";
			document.getElementById("total_amount").value =
				parseInt(total).toLocaleString("en-US") + " " + "UGX";
		}

		if (currentValue >= 35 && currentValue <= 65) {
			// the_fees = localStorage.getItem("network_fee_mid");
			savedCrypto = localStorage.getItem("savedCrypto");
			fee = JSON.parse(savedCrypto)["NORMAL"];
			localStorage.setItem("network_fee", fee);
			total = parseInt(localStorage.getItem("order_amount_fiat")) + parseInt(fee);
			localStorage.setItem("total_amount", total);
			localStorage.setItem("fees_type", "MEDIUM");
			document.getElementById("network_fees").value =
				parseInt(fee).toLocaleString("en-US") + " " + "UGX";
			document.getElementById("total_amount").value =
				parseInt(total).toLocaleString("en-US") + " " + "UGX";
		}

		if (currentValue >= 65) {
			// the_fees = localStorage.getItem("network_fee_high");
			savedCrypto = localStorage.getItem("savedCrypto");
			fee = JSON.parse(savedCrypto)["FAST"];
			localStorage.setItem("network_fee", fee);
			total = parseInt(localStorage.getItem("order_amount_fiat")) + parseInt(fee);
			localStorage.setItem("total_amount", total);
			localStorage.setItem("fees_type", "FAST");
			document.getElementById("network_fees").value =
				parseInt(fee).toLocaleString("en-US") + " " + "UGX";
			document.getElementById("total_amount").value =
				parseInt(total).toLocaleString("en-US") + " " + "UGX";
		}
		return false;
	};

	let order_btn = document.getElementById("confirm");
	let fiat_type = getCookie("fiat_type");

	if (localStorage.getItem("order_type") == "buy") {
		document.getElementById("receive").value =
			localStorage.getItem("order_amount") +
			" " +
			localStorage.getItem("crypto_type");
		document.getElementById("amount").value =
			parseInt(localStorage.getItem("order_amount_fiat")).toLocaleString("en-US") +
			" " +
			getCookie("fiat_type");
		document.getElementById("network_fees").value =
			localStorage.getItem("network_fee") + " " + getCookie("fiat_type");
		document.getElementById("total_amount").value =
			parseInt(localStorage.getItem("total_amount")).toLocaleString("en-US") +
			" " +
			getCookie("fiat_type");
		document.getElementById("cryptocurr").innerHTML =
			localStorage.getItem("crypto_type");
		document.getElementById("crypto_name").innerHTML =
			localStorage.getItem("crypto_type");
	} else {
		document.getElementById("div_net_fee").style.display = "none";
		document.getElementById("div_total_fee").style.display = "none";
		document.getElementById("address").style.display = "none";
		document.getElementById("receive").value =
			parseInt(localStorage.getItem("order_amount_fiat")).toLocaleString("en-US") +
			" " +
			"UGX";
		document.getElementById("amount").value =
			localStorage.getItem("order_amount") +
			" " +
			localStorage.getItem("crypto_type");
		document.getElementById("crypto_name").innerHTML =
			localStorage.getItem("crypto_type");
		document.getElementById("err8").innerHTML =
			"Your MM network or Bank may charge additional fees.";
		document.getElementById("error8").style.display = "block";

		// document.getElementById("cryptocurr").innerHTML = localStorage.getItem("crypto_type");
	}

	order_btn.addEventListener("click", () => {
		document.getElementById("loader").style.display = "block";
		document.getElementById("confirm").disabled = true;
		document.getElementById("confirm").style.display = "none";
		document.getElementById("edit-order").style.display = "none";

		// let add = document.getElementById("address").value;
		const user_id = getCookie("access_token");
		// let user_id = localStorage.getItem("access_token");
		let order_type = localStorage.getItem("order_type");
		let crypto_type = localStorage.getItem("crypto_type");

		document.getElementById("loader").style.display = "block";
		document.getElementById("confirm").disabled = true;
		document.getElementById("confirm").style.display = "none";
		document.getElementById("edit-order").style.display = "none";

		let add = document.getElementById("c_address").value;

		// let fiat_type = localStorage.getItem("fiat_type");

		let order_amount = localStorage.getItem("order_amount");
		let unit_price = localStorage.getItem("unit_price");
		let order_amount_fiat = localStorage.getItem("order_amount_fiat");
		let collect_total = localStorage.getItem("total_amount");
		let fees_type = localStorage.getItem("fees_type");

		//console.log(warning);
		//add some validation to crypto addresses
		let re;
		let valid_addr;

		switch (crypto_type) {
			case "BTC":
				re = new RegExp(
					"\\b(bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|[13][a-km-zA-HJ-NP-Z1-9]{25,35})\\b"
				);
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "ETH":
				re = new RegExp("\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "LTC":
				re = new RegExp("\\b[LM31Q2mn][a-km-zA-HJ-NP-Z1-9]{26,34}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "cUSD":
				re = new RegExp("\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "BCH":
				re = new RegExp(
					"\\b([13][a-km-zA-HJ-NP-Z1-9]{25,34})|^((bitcoincash:)?(q|p)[a-z0-9]{41})|^((BITCOINCASH:)?(Q|P)[A-Z0-9]{41})\\b"
				);
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "BNB":
				re = new RegExp("\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "USDT":
				re = new RegExp("^T[a-km-zA-HJ-NP-Z1-9]{26,34}" || "\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "SEA":
				re = new RegExp("\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			case "CELO":
				re = new RegExp("\\b(0x)?[a-fA-F0-9]{40}\\b");
				if (re.test(add)) {
					valid_addr = 1;
				} else {
					valid_addr = 0;
				}
				break;
			default:
				break;
		}

		if (order_type === "buy") {
			if (valid_addr == 1) {
				let network_fee = localStorage.getItem("network_fee");
				const network_fee_formarted = network_fee.replace(",", "");

				let warning = 0;

				if (network_fee / order_amount_fiat > 0.1) {
					warning = "1";
				} else {
					warning = "0";
				}

				let formdata = {
					related_kyc: user_id,
					order_type: order_type.toUpperCase(),
					crypto_type: crypto_type,
					fiat_type: fiat_type,
					order_amount_crypto: order_amount,
					crypto_unit_price: unit_price,
					order_amount_fiat: order_amount_fiat,
					warning: warning,
					crypto_address: add,
					crypto_fees: network_fee_formarted,
					total_payable_amount_fiat: collect_total,
					crypto_fees_type: fees_type,
				};

				fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formdata),
				})
					.then((res) => res.json())
					.then((data) => {
						document.getElementById("loader").style.display = "none";

						if (data.status == 201) {
							localStorage.getItem("username");
							localStorage.setItem("order_number", data.data.order_number);
							localStorage.setItem("order_id", data.data.id);
							window.location.replace("order-confirmation.html");
						} else if (data.status == 404) {
							document.getElementById("err8").innerHTML =
								"Session expired. Login to place your order";
							document.getElementById("error8").style.display = "block";
							document.getElementById("login-again").style.display = "block";
							document.getElementById("confirm").style.display = "none";
							document.getElementById("edit-order").style.display = "none";
						} else {
							document.getElementById("err8").innerHTML =
								"Try again, something went wrong";
							document.getElementById("error8").style.display = "block";
							document.getElementById("confirm").style.display = "none";
							document.getElementById("edit-order").style.display = "none";
							document.getElementById("try-again").style.display = "block";
						}
					})
					.catch((e) => {
						console.log(e);
						// window.location.replace('404-error.html');
					});
			} else {
				document.getElementById("loader").style.display = "none";
				document.getElementById("err8").innerHTML =
					"Please copy and paste correct address";
				document.getElementById("error8").style.display = "block";
				document.getElementById("confirm").style.display = "block";
				document.getElementById("edit-order").style.display = "block";
				document.getElementById("try-again").style.display = "none";
			}
		} else {
			let formdata = {
				related_kyc: user_id,
				order_type: order_type.toUpperCase(),
				crypto_type: crypto_type,
				fiat_type: fiat_type,
				order_amount_crypto: order_amount,
				crypto_unit_price: unit_price,
				order_amount_fiat: order_amount_fiat,
			};

			fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formdata),
			})
				.then((res) => res.json())
				.then((data) => {
					document.getElementById("loader").style.display = "none";

					if (data.status == 201) {
						localStorage.getItem("username");
						localStorage.setItem("order_number", data.data.order_number);
						window.location.replace("order-confirmation.html");
					} else if (data.status == 404) {
						document.getElementById("err8").innerHTML =
							"Session expired. Login to place your order";
						document.getElementById("error8").style.display = "block";
						document.getElementById("login-again").style.display = "block";
						document.getElementById("confirm").style.display = "none";
						document.getElementById("edit-order").style.display = "none";
					} else {
						document.getElementById("err8").innerHTML =
							"Try again, something went wrong";
						document.getElementById("error8").style.display = "block";
						document.getElementById("confirm").style.display = "none";
						document.getElementById("edit-order").style.display = "none";
						document.getElementById("try-again").style.display = "block";
					}
				})
				.catch((e) => {
					console.log(e);
					// window.location.replace('404-error.html');
				});
		}
	});
});
