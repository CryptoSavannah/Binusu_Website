const fetchRetry = (url, options = {}, retries = 3) => {
    const retryCodes = [408, 500, 502, 503, 504, 522, 524]
    return fetch(url, options)
        .then(res => {
            if (res.ok) return res.json()

            if (retries > 0 && retryCodes.includes(res.status)) {
                return fetchRetry(url, options, retries - 1)
            } else {
                throw new Error(res)
            }
        })
        .catch(console.error)
}

const ratesCall = async () =>
	await fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/rates`)
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("loader").style.display = "none";

			if (data.status == 400) {
				if (data.error == "Rates currently unavailable") {
					window.location.replace("404-error.html");
				} else {
					document.getElementById("error11").style.display = "block";
					document.getElementById("err11").innerHTML = data.error;
				}
			} else if (data.status == 200) {
				document.getElementById("error11").style.display = "none";
				document.getElementById("err11").innerHTML = " ";
				// document.getElementById("to-buy").style.display = 'block';

				return data.data;
			}
		});