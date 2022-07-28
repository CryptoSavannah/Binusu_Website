document.addEventListener("DOMContentLoaded", async function () { 

    document.getElementById('timer').style.display = 'none';
    document.getElementById('doneBtn').style.display = 'none'
    order_id = localStorage.getItem("order_id")
    console.log(order_id)

    const fetchOrderHistory = async () => {
        let formdata = {
            "related_order": order_id,
        };

        fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/specific`, {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(formdata),
								})
									.then((res) => res.json())
									.then((data) => {
										document.getElementById("theorder").innerHTML =
											data.data.order_type.toUpperCase();
										document.getElementById("coinorder").innerHTML =
											data.data.crypto_type;
										document.getElementById("ordernumber").innerHTML =
											data.data.order_number;
										document.getElementById("usermail").innerHTML =
											data.data.related_kyc.email_address;
										document.getElementById("phonenumber").innerHTML =
											data.data.related_kyc.phone_number;
										document.getElementById("mobileamount").innerHTML =
											data.data.total_payable_amount_fiat;
									})
									.catch((e) => {
										console.log(e);
										// window.location.replace('404-error.html');
									});
    }

    let fetch_specific_order = await fetchOrderHistory()

    let collection_btn = document.getElementById("collectBtn")
    collection_btn.addEventListener('click', () => {
      document.getElementById('timer').style.display = 'flex';
      document.getElementById("collectBtn").disabled = true;
      document.getElementById('order-detail').style.display = 'none';

      const FULL_DASH_ARRAY = 283;
      const WARNING_THRESHOLD = 10;
      const ALERT_THRESHOLD = 5;

      const COLOR_CODES = {
        info: {
          color: "green"
        },
        warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD
        },
        alert: {
          color: "red",
          threshold: ALERT_THRESHOLD
        }
      };

      const TIME_LIMIT = 20;
      let timePassed = 0;
      let timeLeft = TIME_LIMIT;
      let timerInterval = null;
      let remainingPathColor = COLOR_CODES.info.color;

      document.getElementById("timer").innerHTML = `
      <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              stroke-dasharray="283"
              class="base-timer__path-remaining ${remainingPathColor}"
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
          timeLeft
        )}</span>
      </div>
      `;

      startTimer();

      function onTimesUp() {
        clearInterval(timerInterval);
      }

      function startTimer() {
        timerInterval = setInterval(() => {
          timePassed = timePassed += 1;
          timeLeft = TIME_LIMIT - timePassed;
          document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
          );
          setCircleDasharray();
          setRemainingPathColor(timeLeft);

          if (timeLeft === 0) {
            onTimesUp();
          }
        }, 1000);
      }

      function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
          seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
      }

      function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
          document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
          document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
          document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
          document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
        }
      }

      function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
      }

      function setCircleDasharray() {
        const circleDasharray = `${(
          calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
          .getElementById("base-timer-path-remaining")
          .setAttribute("stroke-dasharray", circleDasharray);
      }

      let formdata = {
        "related_order": order_id,
    };

    fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/collection`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formdata),
				})
					.then((res) => res.json())
					.then((data) => {
						// document.getElementById("collectBtn").innerHTML = "DONE"
						if (data.status === 200) {
							window.location.replace("order-confirmation.html");
						}
					})
					.catch((e) => {
						console.log(e);
						// window.location.replace('404-error.html');
					});
      
    })
})



