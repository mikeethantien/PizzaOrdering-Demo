var Calculator = function(pricingModel) {
  this.pricingModel = pricingModel;
  this.tax = (pricingModel && pricingModel["tax"]) ? parseFloat(pricingModel["tax"]) : 0.12;
}

/*
 calculateSubtotal
  -function that calculates the total based on the data.
 params:
  -data: json which contains the details of the order.
 */
Calculator.prototype.calculateSubtotal = function(data)
{
  var total = 0;
  if(this.pricingModel)
  {
    for(var key in data)
    {
      var category = this.pricingModel[key];

      if(category)
      {
        var value = data[key];

        //handles multi-selections (toppings...etc)
        if(Array.isArray(value)) {

          value.forEach(function(id) {
            var price = (category[id].price) ? parseFloat(category[id].price) : 0;
            total += price;
          });
        }

        else {
          var price = (category[value].price) ? parseFloat(category[value].price) : 0;
          total += price;
        }
      }
    }
  }

  return total * parseInt(data.quantity);
}

/*
 calculateTax
  -function that calculates the tax based on the total
 params:
  -data: json which contains the details of the order.
 */
Calculator.prototype.calculateTax = function(data)
{
  var total = this.calculateSubtotal(data);

  return total * this.tax;
}

/*
 calculateAmount
  -function that calculates the total after tax
 params:
  -data: json which contains the details of the order.
 */
Calculator.prototype.calculateAmount = function(data)
{
  var total = this.calculateSubtotal(data);
  var tax = this.calculateTax(data);

  return total + tax;
}

module.exports = Calculator;
