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
		"archiveDbOrders": false,	//	true?
		"ysRequest": {
			"Token": getCookie("loginToken"),
			"CatalogName": getCookie("catalogName"),
			"Culture": getCookie("culture"),
			"LanguageId": "tr-TR"
		}
	};
	xmlhttp.send(JSON.stringify(requestBody));
} while (response.HasNextPage);

var restaurantName = document.getElementsByClassName("ys-h2")[0].innerHTML;

//	Filter orders from current restaurant
orders = orders.filter(function (order) {
	return order.RestaurantDisplayName === restaurantName;
});
console.log(orders);

var foods = document.getElementsByClassName("getProductDetail");
var orderItemNameMap = new Map();

orders.forEach(function (order) {
	var orderItemNames = order.OrderItemNames;
	orderItemNames = orderItemNames.map(function(orderItemName) {
		orderItemName = orderItemName.substring(orderItemName.indexOf(" "));
		if (orderItemNameMap.has(orderItemName)) 
		{
			orderItemNameMap.set(orderItemName, orderItemNameMap.get(orderItemName)++);
		}
		else 
		{
			orderItemNameMap.set(orderItemName, 1);
		}
	});
	/*
	[].forEach.call(foods, function(food) {
		var foodName = order.
		if (food.innerHTML === order.)
		{
			food.style.color = "green";
		}
	});
	*/
});

console.log(orderItemNameMap);

/****************** 	UTILITY FUNCTIONS	 ********************/

// https://stackoverflow.com/a/11767598/2931806
function getCookie(cookiename) 
{
	// Get name followed by anything except a semicolon
	var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	// Return everything after the equal sign, or an empty string if the cookie name not found
	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}