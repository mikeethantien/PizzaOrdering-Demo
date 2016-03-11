var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  customerInfo:
   { name: String,
     address: String,
     phoneNumber: String },
  orderInfo:
   { crust: String,
     size: String,
     cheese: String,
     sauce: String,
     toppings: Array,
     quantity: Number },
  subtotal: String,
  tax: String,
  amountDue: String,
  createdOn : {type: String, default: moment().format("YYYY-MM-DD hh:mm a")}
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
