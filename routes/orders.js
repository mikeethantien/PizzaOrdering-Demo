var express = require('express');

//models
var Order = require('../models/order')

//global vars
var router = express.Router();

//loading page data
var ordersPageData = require('../json/ordersPage');
var orderPageData = require('../json/orderPage');

/* GET orders listing. */
router.get('/', function(req, res, next) {

  Order.find({}, function(err, orders){
    if (err) {
      return next(err);
    }
    ordersPageData.orders = orders;
    res.render('orders', ordersPageData);
  });
});

/* GET order by id. */
router.get('/:id', function(req, res, next) {

  Order.findById({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    }

    if(!order) {
      return res.json({"message": "order " + req.param.id + " is not found"});
    }

    var pageData = orderPageData;

    pageData["customerInfo"] = order["customerInfo"];
    pageData["orderInfo"] = order["orderInfo"];
    pageData["subtotal"] = order["subtotal"];
    pageData["tax"] = order["tax"];
    pageData["amountDue"] = order["amountDue"];

    res.render('order', pageData);
  });
});

/* Delete order by id. */
router.delete('/:id', function(req, res, next) {

  Order.find({_id: req.params.id}).remove().exec(function(err) {
    if (err) {
      return next(err);
    }

    res.end();
  });
});

module.exports = router;
