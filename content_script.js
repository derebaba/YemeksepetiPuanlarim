/*
var foodLists = document.getElementsByClassName("listBody");

[].forEach.call(foodLists, function(foodList) {
	var foods = foodList.getElementsByTagName("li");

	[].forEach.call(foods, function(food) {
	food.style.backgroundColor = "red";
	});
});
*/
var foods = document.getElementsByClassName("getProductDetail");

[].forEach.call(foods, function(food) {
	food.style.color = "green";
});
// info no-comment

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function()
{
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{
		var firstResponse = JSON.parse(xmlhttp.responseText);
		
		var orders = firstResponse.OrderHistoryItems;

		console.log(orders);
		/*
		while (response.HasNextPage) 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			{
				let nextResponse = JSON.parse(xmlhttp.responseText);
				orders.push(nextResponse.OrderHistoryItems);
				console.log(orders);
			}

			requestBody.pageNumber++;
			xmlhttp.send(JSON.stringify(requestBody));
		}
		*/
	}
}

xmlhttp.open("POST", "https://www.yemeksepeti.com/Account/GetOrderHistory", true);

xmlhttp.setRequestHeader("Content-Type", "application/json");
xmlhttp.setRequestHeader("Accept", "application/json");
xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

var requestBody = {
	"pageNumber": 1,
	"archiveDbOrders": true,
	"ysRequest": {
		"Token": getCookie("loginToken"),
		"CatalogName": getCookie("catalogName"),
		"Culture": getCookie("culture"),
		"LanguageId": "tr-TR"
	}
};
xmlhttp.send(JSON.stringify(requestBody));


/****************** 	UTILITY FUNCTIONS	 ********************/

// https://stackoverflow.com/a/11767598/2931806
function getCookie(cookiename) 
{
	// Get name followed by anything except a semicolon
	var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	// Return everything after the equal sign, or an empty string if the cookie name not found
	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}