// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.cookies.getAll({"url": "https://www.yemeksepeti.com"}, function(cookies) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			let response = xmlhttp.responseText;
			console.log(response);
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
      "Token": cookies.find(cookie => cookie.name === "loginToken").value,
      "CatalogName": cookies.find(cookie => cookie.name === "catalogName").value,
      "Culture": cookies.find(cookie => cookie.name === "culture").value,
      "LanguageId": "tr-TR"
    }
  };
	xmlhttp.send(JSON.stringify(requestBody));
});
