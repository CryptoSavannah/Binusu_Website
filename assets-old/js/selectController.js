document.addEventListener("DOMContentLoaded", async function () {
	const userId = getCookie("access_token");

	if (userId === "") {
		document.querySelector("#login-bigScreen").style.display = "block";
		document.querySelector("#logout-bigscreen").style.display = "none";
		document.querySelector("#orders").style.display = "none";
	} else {
		document.querySelector("#login-bigScreen").style.display = "none";
		document.querySelector("#logout-bigscreen").style.display = "block";
		document.querySelector("#orders").style.display = "block";
	}

	const fetchData = async () =>
		await fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/rates`)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 400) {
					let count = 0;
					if (count < 5) {
						fetchData();
						count++;
					}
					data.error == "Rates currently unavailable";
					window.location.replace("404-error.html");
				} else if (data.status === 200) {
					document.querySelector("#error11").style.display = "none";
					document.querySelector("#err11").innerHTML = " ";

					return data.data;
				}
			});

	//Initial Rates Call
	let ratesCall = await fetchData();
	localStorage.setItem("rates", JSON.stringify(ratesCall));

	document.querySelector("#loader3").style.display = "none";
	document.querySelector("#rates-text").style.display = "none";
	document.querySelector("#big-form").style.display = "block";

	//Rates call every 5 minutes
	let ratesInterval = window.setInterval(async function () {
		document.querySelector("#loader3").style.display = "block";
		document.querySelector("#rates-text").style.display = "block";
		document.querySelector("#big-form").style.display = "none";
		let ratesCall = await fetchData();
		localStorage.setItem("rates", JSON.stringify(ratesCall));
		document.querySelector("#loader3").style.display = "none";
		document.querySelector("#rates-text").style.display = "none";
		document.querySelector("#big-form").style.display = "block";
	}, 120000);

	const ratesStorage = localStorage.getItem("rates");
	const rates = JSON.parse(ratesStorage);

	//append rates to bottom of page
	document.querySelector("#btcbuy").innerHTML = ratesCall["BTC"].BUY;
	document.querySelector("#btcsell").innerHTML = ratesCall["BTC"].SELL;
	document.querySelector("#ethbuy").innerHTML = ratesCall["ETH"].BUY;
	document.querySelector("#ethsell").innerHTML = ratesCall["ETH"].SELL;
	document.querySelector("#ltcbuy").innerHTML = ratesCall["LTC"].BUY;
	document.querySelector("#ltcsell").innerHTML = ratesCall["LTC"].SELL;
	document.querySelector("#cusdbuy").innerHTML = ratesCall["cUSD"].BUY;
	document.querySelector("#cusdsell").innerHTML = ratesCall["cUSD"].SELL;
	document.querySelector("#bchbuy").innerHTML = ratesCall["BCH"].BUY;
	document.querySelector("#bchsell").innerHTML = ratesCall["BCH"].SELL;
	document.querySelector("#celobuy").innerHTML = ratesCall["CELO"].BUY;
	document.querySelector("#celosell").innerHTML = ratesCall["CELO"].SELL;

	localStorage.setItem("expired", "no");
	document.querySelector("#money-xchange").disabled = true;
	document.querySelector("#coins-exchange").disabled = true;
	document.querySelector("#money-xchanges").disabled = true;
	document.querySelector("#buyrates").style.display = "none";
	document.querySelector("#sellrates").style.display = "none";
	let max = 20000000;

	const computeBuyRate = (cryptoBuyRate, ugxValue) => {
		let buyRate = ugxValue / cryptoBuyRate;
		let displayedBuyRate = buyRate.toFixed(6);
		return displayedBuyRate;
	};

	const computeBuyRateReversed = (cryptoBuyRate, cryptoBuyValue) => {
		let revserseBuyRate = Math.ceil(cryptoBuyRate * cryptoBuyValue);
		return revserseBuyRate;
	};

	const computeSellRate = (cryptoSellRate, cryptoValue) => {
		return Math.ceil(cryptoValue * cryptoSellRate);
	};

	const computeSellRateReversed = (cryptoSellRate, ugxValue) => {
		let reverseSellRate = (ugxValue / cryptoSellRate).toFixed(6);
		return reverseSellRate;
	};

	const computeCryptoMaxSell = (crypto) => {
		return (max / Math.ceil(crypto.BUY)).toFixed(6);
	};

	const selectCryptoBuy = async (crypto) => {
		let buyRates = document.querySelector("#buyrates");

		document.querySelector("#sellrates").style.display = "none";
		const selectedCrypto = rates[crypto];
		buyRates.style.display = "block";

		const minimumUGX = 50000;

		window.localStorage.removeItem("unit_price");
		localStorage.setItem("savedCrypto", JSON.stringify(selectedCrypto));
		localStorage.setItem("unit_price", Math.ceil(selectedCrypto.BUY));
		document.querySelector("#minimumBuy").innerHTML =
			minimumUGX.toLocaleString("en-US");
		document.querySelector("#maximumBuy").innerHTML = max.toLocaleString("en-US");
		document.querySelector("#networkFee").innerHTML =
			selectedCrypto.TRANSFER_FEE_UGX.toLocaleString("en-US");
		document.querySelector("#money-xchange").disabled = false;
		document.querySelector("#coins-exchange").disabled = false;
	};

	const selectCryptoSell = async (crypto) => {
		let sellRates = document.querySelector("#sellrates");

		document.querySelector("#buyrates").style.display = "none";
		const selectedCrypto = rates[crypto];

		sellRates.style.display = "block";
		setCookie("fiat_type", "UGX");
		localStorage.setItem("savedCrypto", JSON.stringify(selectedCrypto));

		document.querySelector("#minimumSell").innerHTML = selectedCrypto.MINIMUM_CRYPTO_AMOUNT
		
		document.querySelector("#maximumSell").innerHTML = computeCryptoMaxSell(selectedCrypto)
		document.querySelector("#coins-exchanges").disabled = false;
		document.querySelector("#money-xchanges").disabled = false;
	};

	const computeCryptoEquivalent = (crypto, ugxValue) => {
		let min = parseInt(50000);
		let ugx = document.querySelector("#money-xchange");
		let cryptoBuy = document.querySelector("#coins-exchange");
		if (ugx.value < min || ugx.value > max) {
			ugx.style.border = "1px solid red";
			cryptoBuy.style.border = "1px solid red";
			cryptoBuy.value = null;
			document.querySelector("#buyrates").style.fontWeight = "800";
		} else {
			document.querySelector("#sellrates").style.fontWeight = "800";
			ugx.style.border = "1px solid green";
			cryptoBuy.style.border = "1px solid green";
			const equivalent = computeBuyRate(crypto.SELL, ugxValue);
			document.querySelector("#coins-exchange").value = equivalent;
		}
	};

	const buyCryptoRevsersed = (crypto, cryptoBuyValue) => {
		let min = parseInt(50000);
		let ugx = document.querySelector("#money-xchange");
		let cryptoBuy = document.querySelector("#coins-exchange");

		const equivalent = computeBuyRateReversed(crypto.SELL, cryptoBuyValue);
		ugx.value = equivalent;

		if (ugx.value < min || ugx.value > max) {
			ugx.style.border = "1px solid red";
			cryptoBuy.style.border = "1px solid red";
			document.querySelector("#buyrates").style.fontWeight = "800";
		} else {
			ugx.style.border = "1px solid green";
			cryptoBuy.style.border = "1px solid green";
		}
	};

	const computeUgxEquivalent = (crypto, cryptoValue) => {
		let cryptoMin = parseFloat(crypto.MINIMUM_CRYPTO_AMOUNT);
		let cryptoMax = computeCryptoMaxSell(crypto);
		if (
			parseFloat(cryptoValue) < cryptoMin ||
			parseFloat(cryptoValue) > parseFloat(cryptoMax)
		) {
			document.querySelector("#coins-exchanges").style.border = "1px solid red";
			document.querySelector("#money-xchanges").value = null;
			document.querySelector("#sellrates").style.fontWeight = "800";
		} else {
			cryptoSell = document.querySelector("#coins-exchanges").style.border =
				"1px solid red";
			document.querySelector("#sellrates").style.fontWeight = "500";
			const equivalent = computeSellRate(crypto.BUY, cryptoValue);
			document.querySelector("#money-xchanges").value = equivalent;

			window.localStorage.removeItem("unit_price");
			localStorage.setItem("unit_price", Math.ceil(crypto.BUY));
		}
	};

	const sellCryptoRevsersed = (crypto, ugxValue) => {
		let cryptoMin = parseFloat(crypto.MINIMUM_CRYPTO_AMOUNT);
		let cryptoMax = computeCryptoMaxSell(crypto);
		let cryptoValue = document.querySelector("#coins-exchanges");

		const equivalent = computeSellRateReversed(crypto.BUY, ugxValue);
		cryptoValue.value = equivalent;

		if (
			cryptoValue.value < cryptoMin ||
			cryptoValue.value > parseFloat(cryptoMax)
		) {
			document.querySelector("#coins-exchanges").style.border = "1px solid red";
			document.querySelector("#money-xchanges").style.border = "1px solid red";
			document.querySelector("#sellrates").style.fontWeight = "800";
		} else {
			document.querySelector("#coins-exchanges").style.border = "1px solid green";
			document.querySelector("#money-xchanges").style.border = "1px solid green";
			document.querySelector("#sellrates").style.fontWeight = "500";
		}
	};

	document
		.querySelector("#money-exchange")
		.addEventListener("change", (event) => {
			const option = event.target.value;
			document.querySelector("#dcoin-exchange").selectedIndex = null;

			if (option === "buy") {
				document.querySelector("#money-xchange").disabled = true;
				document.querySelector("#input-boxes2").style.display = "none";
				document.querySelector("#input-boxes").style.display = "block";
				document
					.querySelector("#dcoin-exchange")
					.addEventListener("change", (event) => {
						document.querySelector(
							"#coins-exchange"
						).placeholder = `${event.target.value} amount`;
						selectCryptoBuy(event.target.value);
						savedCrypto = localStorage.getItem("savedCrypto");
						if (savedCrypto !== "" || savedCrypto !== null) {
							computeCryptoEquivalent(
								JSON.parse(savedCrypto),
								document.querySelector("#money-xchange").value
							);
						}
					});
			} else if (option === "sell") {
				document.querySelector("#coins-exchanges").disabled = true;
				document.querySelector("#input-boxes").style.display = "none";
				document.querySelector("#input-boxes2").style.display = "block";
				document
					.querySelector("#dcoin-exchange")
					.addEventListener("change", (event) => {
						selectCryptoSell(event.target.value);
						savedCrypto = localStorage.getItem("savedCrypto");
						if (savedCrypto !== "" || savedCrypto !== null) {
							computeUgxEquivalent(
								JSON.parse(savedCrypto),
								document.querySelector("#coins-exchanges").value
							);
						}
					});
			}
		});

	document.querySelector("#money-xchange").addEventListener("input", (event) => {
		savedCrypto = localStorage.getItem("savedCrypto");
		computeCryptoEquivalent(JSON.parse(savedCrypto), event.target.value);
	});

	document
		.querySelector("#coins-exchange")
		.addEventListener("input", (event) => {
			savedCrypto = localStorage.getItem("savedCrypto");
			buyCryptoRevsersed(JSON.parse(savedCrypto), event.target.value);
		});

	document
		.querySelector("#coins-exchanges")
		.addEventListener("input", (event) => {
			savedCrypto = localStorage.getItem("savedCrypto");
			computeUgxEquivalent(JSON.parse(savedCrypto), event.target.value);
		});

	document
		.querySelector("#money-xchanges")
		.addEventListener("input", (event) => {
			savedCrypto = localStorage.getItem("savedCrypto");
			sellCryptoRevsersed(JSON.parse(savedCrypto), event.target.value);
		});
});
