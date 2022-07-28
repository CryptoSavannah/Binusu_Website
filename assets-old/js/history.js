document.addEventListener("DOMContentLoaded", async function () {
	const userId = getCookie("access_token");

	if (userId === "") {
		document.querySelector("#login-bigScreen").style.display = "block";
		document.querySelector("#logout-bigscreen").style.display = "none";
		// document.querySelector("#acc-bigscreen").style.display = 'none';
	} else {
		document.querySelector("#login-bigScreen").style.display = "none";
		document.querySelector("#logout-bigscreen").style.display = "block";
		// document.querySelector("#acc-bigscreen").style.display = 'block';
	}

	const order_id = localStorage.getItem("order_id");
	document.querySelector("#loader-holder").style.display = "none";
	document.querySelector("#historyTable").style.display = "block";
	document.querySelector("#pendingTable").style.display = "none";
	document.querySelector("#completedTable").style.display = "none";
	document.querySelector("#failureTable").style.display = "none";

	function readableDate(data) {
		return data.filter((value) => {
			if (value.date_ordered) {
				return (value.date_ordered = moment(value.date_ordered).fromNow());
			}
		});
	}

	var historyTable = $("#example").DataTable({
		data: [],
		order: [[0, "desc"]],
		columns: [
			{
				title: "ID",
				data: "id",
				visible: false,
			},
			{
				title: "Order Number",
				data: "order_number",
			},
			{
				title: "Order Type",
				data: "order_type",
			},
			{
				title: "Crypto Type",
				data: "crypto_type",
			},
			{
				title: "Crypto Amount",
				data: "order_amount_crypto",
			},
			{
				title: "UGX Amount",
				data: "order_amount_fiat",
			},
			{
				title: "Crypto Price",
				data: "crypto_unit_price",
			},
			{
				title: "Date Ordered",
				data: "date_ordered",
			},
			{
				title: "Actions",
				data: null,
				render: function (data, type, row) {
					return '<button type="button" class="btn btn-primary btn-sm" >Pay now</button>';
				},
			},
		],
		responsive: true,
	});

	var pendingTable = $("#example1").DataTable({
		data: [],
		order: [[0, "desc"]],
		columns: [
			{
				title: "ID",
				data: "id",
				visible: false,
			},
			{
				title: "Order Number",
				data: "order_number",
			},
			{
				title: "Order Type",
				data: "order_type",
			},
			{
				title: "Crypto Type",
				data: "crypto_type",
			},
			{
				title: "Crypto Amount",
				data: "order_amount_crypto",
			},
			{
				title: "UGX Amount",
				data: "order_amount_fiat",
			},
			{
				title: "Crypto Price",
				data: "crypto_unit_price",
			},
			{
				title: "Date Ordered",
				data: "date_ordered",
			},
			{
				title: "Actions",
				data: null,
				render: function (data, type, row) {
					return (
						'<button type="button" class="btn btn-primary btn-sm">View Details</button>'
					);
				},
			},
		],
		responsive: true,
	});

	var completedTable = $("#example2").DataTable({
		data: [],
		order: [[0, "desc"]],
		columns: [
			{
				title: "ID",
				data: "id",
				visible: false,
			},
			{
				title: "Order Number",
				data: "order_number",
			},
			{
				title: "Order Type",
				data: "order_type",
			},
			{
				title: "Crypto Type",
				data: "crypto_type",
			},
			{
				title: "Crypto Amount",
				data: "order_amount_crypto",
			},
			{
				title: "UGX Amount",
				data: "order_amount_fiat",
			},
			{
				title: "Crypto Price",
				data: "crypto_unit_price",
			},
			{
				title: "Date Ordered",
				data: "date_ordered",
			},
		],
		responsive: true,
	});

	var failedTable = $("#example3").DataTable({
		data: [],
		order: [[0, "desc"]],
		columns: [
			{
				title: "ID",
				data: "id",
				visible: false,
			},
			{
				title: "Order Number",
				data: "order_number",
			},
			{
				title: "Order Type",
				data: "order_type",
			},
			{
				title: "Crypto Type",
				data: "crypto_type",
			},
			{
				title: "Crypto Amount",
				data: "order_amount_crypto",
			},
			{
				title: "UGX Amount",
				data: "order_amount_fiat",
			},
			{
				title: "Crypto Price",
				data: "crypto_unit_price",
			},
			{
				title: "Date Ordered",
				data: "date_ordered",
			},
		],
		responsive: true,
	});

	var fetchPendingOrderHistory = async () => {
		let formdata = {
			related_kyc: userId,
			status: "UNFULFILLED",
		};

		fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/clients`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formdata),
		})
			.then((res) => res.json())
			.then((data) => {
				let newData = readableDate(data.data);
				let sortedData = newData.sort(function(a, b){return b.id - a.id});
				console.log(sortedData)
				historyTable.clear();
				historyTable.rows.add(sortedData).draw();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	var fetchProcessingOrderHistory = async () => {
		let formdata = {
			related_kyc: userId,
			status: "PROCESSING",
		};

		fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/clients`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formdata),
		})
			.then((res) => res.json())
			.then((data) => {
				let newData = readableDate(data.data);
				let sortedData = newData.sort(function(a, b){return b.id - a.id});
				console.log(sortedData)
				pendingTable.clear();
				pendingTable.rows.add(sortedData).draw();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	var fetchCompletionOrderHistory = async () => {
		let formdata = {
			related_kyc: userId,
			status: "FULFILLED",
		};

		fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/clients`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formdata),
		})
			.then((res) => res.json())
			.then((data) => {
				let newData = readableDate(data.data);
				completedTable.clear();
				completedTable.rows.add(newData).draw();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	var fetchFailureOrderHistory = async () => {
		let formdata = {
			related_kyc: userId,
			status: "FAILED",
		};

		fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/clients`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formdata),
		})
			.then((res) => res.json())
			.then((data) => {
				let newData = readableDate(data.data);
				failedTable.clear();
				failedTable.rows.add(newData).draw();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	$("#example tbody").on("click", "button", async function () {
		var data = historyTable.row($(this).parents("tr")).data();
		// historyTable.buttons().disable()

		if (data.order_type === "SELL") {
			let a = await confirmCryptoCollcetion(data.id);
		} else {
			let a = await confirmMobileMoneyCollection(data.id);
		}
	});

	$("#example1 tbody").on("click", "button", async function () {
		var data = pendingTable.row($(this).parents("tr")).data();
		printDetails = `
			<p>Order Number: <span>${data.order_number}</span></p>
			<p>Order Type: <span>${data.order_type}</span></p>
			<p>Crypto Amount: <span>${data.order_amount_crypto}</span></p>
			<p>UGX Amount: <span>${data.order_amount_fiat}</span></p>
			<p>Status: <span>${data.order_status}</span></p>
		`;
		console.log(data)
		Swal.fire({
			title: "<h3>Order Details</h3>",
			html: printDetails,
		});
		
	});

	var confirmCryptoCollcetion = async (order_id) => {
		document.querySelector("#loader-holder").style.display = "flex";
		let formdata = {
			related_order: order_id,
	};

		fetch(
			`https://mc1.cryptosavannah.com/api/v1/binusu/orders/collection/crypto`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formdata),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				let message = hex_to_ascii(data.popup);
				document.querySelector("#loader-holder").style.display = "none";
				$("#popupalert").html(message);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	var confirmMobileMoneyCollection = async (order_id) => {
		document.querySelector("#loader-holder").style.display = "flex";
		let formdata = {
			related_order: order_id,
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
				let message = hex_to_ascii(data.popup);
				document.querySelector("#loader-holder").style.display = "none";
				$("#popupalert").html(message);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	function hex_to_ascii(str1) {
		var hex = str1.toString();

		var str = "";

		for (var n = 0; n < hex.length; n += 2) {
			str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
		}
		return str;
	}

	// var fetchOrderCollectionHistory = async () => {
	// 	let formdata = {
	// 		related_order: order_id,
	// 	};

	// 	fetch(`https://mc1.cryptosavannah.com/api/v1/binusu/orders/completion`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(formdata),
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			pendingTable.clear();
	// 			pendingTable.rows.add(data.data).draw();
	// 		})
	// 		.catch((e) => {
	// 			console.log(e);
	// 		});
	// };

	await fetchPendingOrderHistory();

	document
		.querySelector("#money-exchange")
		.addEventListener("change", async (event) => {
			const option = event.target.value;
			if (option === "pending") {
				await fetchPendingOrderHistory();
				document.querySelector("#historyTable").style.display = "block";
				document.querySelector("#pendingTable").style.display = "none";
				document.querySelector("#completedTable").style.display = "none";
				document.querySelector("#failureTable").style.display = "none";
			} else if (option === "processing") {
				await fetchProcessingOrderHistory();
				document.querySelector("#historyTable").style.display = "none";
				document.querySelector("#pendingTable").style.display = "block";
				document.querySelector("#completedTable").style.display = "none";
				document.querySelector("#failureTable").style.display = "none";
			} else if (option === "complete") {
				await fetchCompletionOrderHistory();
				document.querySelector("#historyTable").style.display = "none";
				document.querySelector("#pendingTable").style.display = "none";
				document.querySelector("#completedTable").style.display = "block";
				document.querySelector("#failureTable").style.display = "none";
			} else if (option === "failed") {
				await fetchFailureOrderHistory();
				document.querySelector("#historyTable").style.display = "none";
				document.querySelector("#pendingTable").style.display = "none";
				document.querySelector("#completedTable").style.display = "none";
				document.querySelector("#failureTable").style.display = "block";
			}
		});
});
