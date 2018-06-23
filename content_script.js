/*
var foodLists = document.getElementsByClassName("listBody");

[].forEach.call(foodLists, function(foodList) {
	var foods = foodList.getElementsByTagName("li");

	[].forEach.call(foods, function(food) {
	food.style.backgroundColor = "red";
	});
});
*/
var orders = [];
orders = orders.concat(getOrderHistory(false));
orders = orders.concat(getOrderHistory(true));

var restaurantName = document.getElementsByClassName("ys-h2")[0].textContent;

//	Filter orders from current restaurant
orders = orders.filter(function (order) {
	return order.RestaurantDisplayName === restaurantName;
});
console.log(orders);

var menu = new Array();	//	menu[orderItemName] = [points array]

orders.forEach(function (order) {
	if (order.RatingStatus === "Already Rated")
	{
		var orderItemNames = order.OrderItemNames;
		orderItemNames = orderItemNames.map(function(orderItemName) {
			orderItemName = orderItemName.substring(orderItemName.indexOf(" ") + 1);	//	remove number of orders
			
			if (!menu[orderItemName]) 
			{
				menu[orderItemName] = [];
			}
			
			menu[orderItemName].push(order.OrderCommentSummary.UserComment);
		});
	}
});

var foods = document.getElementsByClassName("getProductDetail");

[].forEach.call(foods, function(food) {
	let ratings = menu[food.textContent];

	if (ratings)
	{
		console.log(ratings);
		let speed = 0, serving = 0, flavour = 0;
		ratings.forEach(function (rating) {
			speed += rating.Speed;
			serving += rating.Serving;
			flavour += rating.Flavour;
		});
		//	calculate average
		let voteCount = ratings.length;
		speed = speed / voteCount;
		serving = serving / voteCount;
		flavour = flavour / voteCount;
		food.innerHTML += "<span style='color: green;'> (Hız: " + speed + ", Servis: " + serving + ", Lezzet: " + flavour + ")("
		 + voteCount + " oy)</span>";
	}
});

console.log(menu);

/****************** 	UTILITY FUNCTIONS	 ********************/

// https://stackoverflow.com/a/11767598/2931806
function getCookie(cookiename) 
{
	// Get name followed by anything except a semicolon
	var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	// Return everything after the equal sign, or an empty string if the cookie name not found
	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function getOrderHistory(archiveDbOrders)
{
	var orders = [];
	var pageNumber = 1;
	var response;
	do
	{
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			{
				response = JSON.parse(xmlhttp.responseText);
				
				orders = orders.concat(response.OrderHistoryItems);
			}
		}

		xmlhttp.open("POST", "https://www.yemeksepeti.com/Account/GetOrderHistory", false);

		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.setRequestHeader("Accept", "application/json");
		xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		var requestBody = {
			"pageNumber": pageNumber++,
			"archiveDbOrders": archiveDbOrders,
			"ysRequest": {
				"Token": getCookie("loginToken"),
				"CatalogName": getCookie("catalogName"),
				"Culture": getCookie("culture"),
				"LanguageId": "tr-TR"
			}
		};
		xmlhttp.send(JSON.stringify(requestBody));
	} while (response.HasNextPage);

	return orders;
}