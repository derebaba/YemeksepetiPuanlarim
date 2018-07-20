var _orders = [];

getOrderHistory(1, false);

/******************  FUNCTIONS  ********************/

// https://stackoverflow.com/a/11767598/2931806
function getCookie(cookiename) 
{
	// Get name followed by anything except a semicolon
	var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
	// Return everything after the equal sign, or an empty string if the cookie name not found
	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function getOrderHistory(pageNumber, archiveDbOrders)
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			response = JSON.parse(xmlhttp.responseText);
			
			//	concatenate result to global orders array
			_orders = _orders.concat(response.OrderHistoryItems);
			
			if (response.HasNextPage)
			{
				getOrderHistory(pageNumber + 1, archiveDbOrders);
			}
			else if (!archiveDbOrders)
			{
				//	non-archiveDbOrders are finished, collect archiveDbOrders
				getOrderHistory(1, true);
			}
			else
			{
				//	all orders are collected
				var restaurantName = document.getElementsByClassName("ys-h2")[0].textContent;

				//	Filter orders from current restaurant
				_orders = _orders.filter(function (order) {
					return order.RestaurantDisplayName === restaurantName;
				});

				var menu = new Array();	//	menu[orderItemName] = [points array]

				_orders.forEach(function (order) {
					if (order.RatingStatus === "Already Rated")
					{
						var orderItemNames = order.OrderItemNames;
						orderItemNames = orderItemNames.map(function(orderItemName) {
							orderItemName = orderItemName.substring(orderItemName.indexOf(" ") + 1);	//	remove number of orders
							
							if (!menu[orderItemName]) 
							{
								menu[orderItemName] = [];
							}
							
							//	user comments are stored in two different formats. if it is null, get values from somewhere else
							let userComment = order.OrderCommentSummary.UserComment;
							if (!userComment)
							{
								userComment = {
									"Speed": order.Speed,
									"Serving": order.Serving,
									"Flavour": order.Flavour
								}
							}
							menu[orderItemName].push(userComment);
						});
					}
				});

				var foods = document.getElementsByClassName("getProductDetail");

				[].forEach.call(foods, function(food) {
					let ratings = menu[food.textContent];

					if (ratings)
					{
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
						food.innerHTML += "<span style='color: green;'> (Hız: " + speed.toFixed(2) + ", Servis: " + serving.toFixed(2) + ", Lezzet: "
						+ flavour.toFixed(2) + ")(" + voteCount + " oy)</span>";
					}
				});
			}
		}
	}

	xmlhttp.open("POST", "https://www.yemeksepeti.com/Account/GetOrderHistory", true);

	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.setRequestHeader("Accept", "application/json");
	xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	var requestBody = {
		"pageNumber": pageNumber,
		"archiveDbOrders": archiveDbOrders,
		"ysRequest": {
			"Token": getCookie("loginToken"),
			"CatalogName": getCookie("catalogName"),
			"Culture": getCookie("culture"),
			"LanguageId": "tr-TR"
		}
	};
	xmlhttp.send(JSON.stringify(requestBody));
}