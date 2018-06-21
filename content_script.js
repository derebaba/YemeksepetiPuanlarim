var foodLists = document.getElementsByClassName("listBody");

[].forEach.call(foodLists, function(foodList) {
  var foods = foodList.getElementsByTagName("li");

  [].forEach.call(foods, function(food) {
    food.style.backgroundColor = "red";
  });
});

// info no-comment