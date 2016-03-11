$( document ).ready(function() {

    //Regsiters the click event handler for the delete button on the orders page.
    $(this).find(".btn-delete").on("click", function(e) {

      e.stopPropagation();

      if(e)
      {
        var id = $(e.currentTarget).data("for");
        var request = $.ajax({
          url: "orders/" + id,
          type: 'DELETE'
        })
        .done(function() {
          window.location.href = '/orders';
          console.log("Entry " + id + " has been deleted successfully.");
        })
        .fail(function( jqXHR, textStatus ) {
          console.log("Request failed: " + textStatus);
        });
      }
    });

    //Registers the click event handler on each table row on the orders page.
    $(this).find("tr").on("click", function(e) {
      if(e)
      {
        var id = $(e.currentTarget).prop("id");
        window.location.href = '/orders/' + id;
      }
    });

    //Registers the click event hanlder on back button on the order details page. 
    $(this).find(".btn-back").on("click", function(e) {
      if(e) {
        window.history.back();
      }
    });
});
