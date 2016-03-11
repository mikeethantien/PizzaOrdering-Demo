var Helpers = function() {}

/*
 populatePricingModels
   -function that combine the pricing information in the order information.
 params:
   -orderInformation: object that contains the data needed for rendering the order information.
   -pricingModel: object that contains the pricing scheme for each item.
 */
Helpers.prototype.populatePricingModels = function(orderInformation, pricingModel) {

  if(orderInformation && pricingModel)
  {
    //dump the matching items from the pricing model in the JSON
    var items = orderInformation.items;

    items.forEach(function(item) {
      var category = item.id;
      var pricingItems = pricingModel[category];

      if(pricingItems)
      {
        var data = [];
        for(var k in pricingItems)
        {
          data.push(pricingItems[k]);
        }

        item.data = data;
      }
    });
  }
}

/*
 constructOrderData
    -function that constructs the orderData used for calculating the price.
 params:
    -requestBody: json which contains the body of the request.
 */
Helpers.prototype.constructOrderData = function(requestBody) {

  //order data used for the calculation
  return {
    "crust": requestBody.crust,
    "size": requestBody.size,
    "cheese": requestBody.cheese,
    "sauce": requestBody.sauce,
    "toppings": (requestBody.toppings) ? (requestBody.toppings) : [],
    "quantity": requestBody.quantity
  };
}

/*
 constructCustomerInfo
    -function that constructs the customer info used for display.
 params:
    -requestBody: json which contains the body of the request.
 */
Helpers.prototype.constructCustomerInfo = function(requestBody) {

  return {
    "name": requestBody.firstName + " " + requestBody.lastName,
    "address": ((requestBody.unitNumber) ? requestBody.unitNumber + " - " : "") + requestBody.streetNumber + " " +
                                                                                  requestBody.streetName + ", " +
                                                                                  requestBody.city + ", " +
                                                                                  requestBody.province + ", " +
                                                                                  requestBody.postcode,
    "phoneNumber": requestBody.phoneNumber
  }
}

/*
 constructOrderInfo
    -function that constructs the order info used for display.
 params:
    -requestBody: json which contains the body of the request.
    -pricingModel: object that contains the pricing scheme for each item.
 */
Helpers.prototype.constructOrderInfo = function(requestBody, pricingModel, orderData) {

  var toppings = [];
  if(requestBody.toppings)
  {
    if(Array.isArray(requestBody.toppings))
    {
      requestBody.toppings.forEach(function(topping) {
        toppings.push(pricingModel["toppings"][topping].label);
      });
    }

    else {
      toppings.push(pricingModel["toppings"][orderData["toppings"]].label);
    }
  }

  //order information used for display
  return {
    "crust": pricingModel["crust"][orderData["crust"]].label,
    "size": pricingModel["size"][orderData["size"]].label,
    "cheese": pricingModel["cheese"][orderData["cheese"]].label,
    "sauce": pricingModel["sauce"][orderData["sauce"]].label,
    "toppings": toppings,
    "quantity": requestBody.quantity
  }
}

module.exports = Helpers;
