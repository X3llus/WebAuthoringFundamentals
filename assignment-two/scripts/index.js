// list of premade pizzas so i can iterate through each possible inputted pizza
const mades = ["pep", "mar", "che", "can", "haw", "mea", "veg"];
// so i can change the short hand to the full name
const sToL = {
  "pep": "Pepperoni",
  "mar": "Margherita",
  "che": "Cheese",
  "can": "Canadian",
  "haw": "Hawaiian",
  "mea": "Meat Lovers",
  "veg": "Veggie"
};
// price for each size for ease of getting total
const priceSize = {
  "Small": 8,
  "Medium": 10,
  "Large": 12,
  "Party": 14
};

// checks if an order has been started, if one has it adds in the confirm order button
function makeOrderButton() {
  if (sessionStorage.getItem("order") != null && sessionStorage.getItem("order") != JSON.stringify({
      "custom": []
    })) {
    document.getElementById("buttons").innerHTML +=
      '<li><a href="order.html">Confirm Your Order</a></li>';
  }
}

// gets your order from the session storage or makes an empty order if there is none
function checkStorage() {
  if (sessionStorage.getItem("order") != null) {
    var storage = JSON.parse(sessionStorage.getItem("order"));
  } else {
    var storage = {
      "custom": []
    };
  }
  return storage;
}

/*
submit funciton for the premade pizza form
gets the order, iterates through each pizza
if the value of that pizza is more than one
  add that many pizzas to the order
put the order in session storage
*/
function madeSubmit() {
  order = checkStorage();
  mades.forEach((item, index) => {
    if (document.getElementById(item).value > 0) {
      if (order[item] == null) order[item] = parseInt(document.getElementById(item).value);
      else order[item] = parseInt(document.getElementById(item).value) + parseInt(order[item]);
    }
  });
  sessionStorage.setItem("order", JSON.stringify(order));
}

/*
submit function for custom pizza builder
gets the order, and all values from the form
goes through each element in the toppings list and adds it to the pizza
adds the pizza to the order and puts the order in session storage
*/
function buildSubmit() {
  order = checkStorage();
  var size = document.querySelector('input[name="size"]:checked').value;
  var crust = document.querySelector('input[name="crust"]:checked').value;
  var sauce = document.getElementById("sauce").value;
  var cheese = document.getElementById("cheese").value;

  var toppings = [];
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

  for (var i = 0; i < checkboxes.length; i++) {
    toppings.push(checkboxes[i].value);
  }

  order["custom"].push({
    "size": size,
    "crust": crust,
    "sauce": sauce,
    "cheese": cheese,
    "toppings": toppings
  });

  sessionStorage.setItem("order", JSON.stringify(order));
}

/*
builds the order list on the order confirmation page and calculates total
gets the order and sets total to 0
iterates through each element
if the element is a premade pizza
  add it to the list
if the element is the custom pizza list
  iterate through the custom pizzas and build the list item
  make a new unordered list for toppings
  iterate through the toppings and add them each as a list item to the new unordered list
sets the total
*/
function makeOrder() {
  let total = 0;
  var order = checkStorage();
  for (o in order) {
    if (o != "custom") {
      document.getElementById("pizzas").innerHTML += (
        `<li class="item" onclick="deleteItem('${o}')">${sToL[o]} x${order[o]}</li>`);
      total += (11 * order[o]);
    }
  }
  for (c in order["custom"]) {
    document.getElementById("pizzas").innerHTML += (
      `<li class="item" onclick="deleteItem(${c})"> ${order["custom"][c]["size"]}, ${order["custom"][c]["crust"]} crust with: <ul id=${c}><li>${order["custom"][c]["sauce"]}</li><li>${order["custom"][c]["cheese"]}</li></ul>`
    );

    total += priceSize[order["custom"][c]["size"]]

    let toppings = order["custom"][c]["toppings"];
    for (t in toppings) {
      document.getElementById(c).innerHTML += (
        `<li> ${toppings[t]} </li>`
      );
      total += 0.5;
    }
  }
  document.getElementById("total").innerHTML = (
    `<p>Total: $${total}</p>`
  );
}

/*
funciton for deleting items from the order
get the order
if the item is a number (custom pizza index)
  splice the array
else
  delete the element from the object
put new order in the session storage and reload the page
*/
function deleteItem(item) {
  var order = JSON.parse(sessionStorage.getItem("order"));
  if (typeof item == "number") {
    order["custom"] = order["custom"].splice(1, item);
  } else {
    delete order[item];
  }
  sessionStorage.setItem("order", JSON.stringify(order));
  document.location.reload(true);
}
