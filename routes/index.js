var express = require('express');
var accounting = require('accounting');

//models
var Order = require('../models/order')

//loading page data
var homePageData = require('../json/homePage');
var pricing = require('../json/pricing');

//helpers
var Calculator = require('../javascripts/calculator');
var Helpers = require('../javascripts/helpers');

//global vars
var router = express.Router();
var currency = (pricing && pricing["currency"]) ? pricing["currency"] : "$";
var calculator = new Calculator();
var helpers = new Helpers();
var orderInformation = {};

//Initializes the JSON for loading the home page.
router.use(function(req, res, next) {
  //retrieve the group data which generates the order information
  if(homePageData)
  {
    for(var i in homePageData.groups)
    {
      var group = homePageData.groups[i];

      if(group.id === "orderInformation") {
        orderInformation = group;
        break;
      }
    }
  }

  helpers.populatePricingModels(orderInformation, pricing);
  homePageData["currency"] = currency;

  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  homePageData["orderSubmitted"] = null;
  res.render('index', homePageData);
});

/* POST a new order */
router.post('/', function(req, res) {

  //order data used for the calculation
  var orderData = helpers.constructOrderData(req.body);

  //customer information used for display
  var customerInfo = helpers.constructCustomerInfo(req.body);

  //order information used for display
  var orderInfo = helpers.constructOrderInfo(req.body, pricing, orderData);

  var obj = {};
  obj["customerInfo"] = customerInfo;
  obj["orderInfo"] = orderInfo;

  var calculator = new Calculator(pricing);

  obj["subtotal"] = accounting.formatMoney(calculator.calculateSubtotal(orderData), currency);
  obj["tax"] = accounting.formatMoney(calculator.calculateTax(orderData), currency);
  obj["amountDue"] = accounting.formatMoney(calculator.calculateAmount(orderData), currency);

  var order = new Order(obj);

  order.save(function(err) {
    if (err) {
      console.log("save failed");
      homePageData["orderSubmitted"] = false;
    }
    else {
      console.log("save succeed");
      homePageData["orderSubmitted"] = true;
    }

    res.render('index', homePageData);
  });
});

//REST endpoints
//Retrieves the entire list of orders.
//Example: GET http://localhost:3000/api/orders
router.get('/api/orders', function(req, res, next) {
  Order.find({}, function(err, orders){
    if (err) {
      return next(err);
    }
    res.json(orders);
  });
});

//Retrieves the order by the specified id.
//Example: GET http://localhost:3000/api/orders/55b5294f6f8d07b844b43ea3
router.get('/api/orders/:id', function(req, res, next) {
  Order.findById(req.params.id, function(err, order){
    if (err) {
      return next(err);
    }
    res.json(order);
  });
});

/*
//Create a new order.
//Example: POST http://localhost:3000/api/orders
           Body: {
  "subtotal": "$12.00",
  "tax": "$1.44",
  "amountDue": "$30.44",
  "createdOn": "2015-07-26 11:37 am",
  "orderInfo": {
    "crust": "Thin",
    "size": "8\"",
    "cheese": "Mazzarella",
    "sauce": "BBQ",
    "quantity": 1,
    "toppings": [
      "Beef"
    ]
  },
  "customerInfo": {
    "name": "Kyle Brovlaski",
    "address": "12 - 32 Water Street, Vancouver, British Columbia, V6B5N4",
    "phoneNumber": "5555555555"
  }
} */
router.post('/api/orders', function(req, res, next) {

  console.log(JSON.stringify(req.body));
  var orderJSON = req.body;
  var order = new Order(orderJSON);

  var requiredFields = ["subtotal", "tax", "amountDue", "orderInfo", "customerInfo"];
  var requiredOrderInfoFields = ["crust", "size", "cheese", "sauce", "quantity"];
  var requiredCustomerInfoFeilds = ["name", "address", "phoneNumber"];

  //validation
  for(var i in requiredFields) {
    var field = requiredFields[i];

    if(!order[field])
    {
      res.status(400);
      return res.json({"status" : 400, "message" : "Missing " + field + "."});
    }
  }

  //orderInfo will exist at this point if the previous check passes.
  var orderInfo = order.orderInfo;
  for(var j in requiredOrderInfoFields) {
    var field = requiredOrderInfoFields[j];

    if(!orderInfo[field])
    {
      res.status(400);
      return res.json({"status" : 400, "message" : "Missing " + field + "."});
    }
  }

  //customerInfo will exist at this point if the previous check passes.
  var customerInfo = order.customerInfo;
  for(var k in requiredCustomerInfoFeilds) {
    var field = requiredCustomerInfoFeilds[k];

    if(!customerInfo[field])
    {
      res.status(400);
      return res.json({"status" : 400, "message" : "Missing " + field + "."});
    }
  }

  order.save(function(err) {
    if (err) {
      return res.status(500).json({error : "Failed to save the order"});
    }
    else {
      return res.json({"status" : 200, "message" : "Added new order"});
    }
  });

});
module.exports = router;
