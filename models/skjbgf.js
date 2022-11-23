// razor pay verify payment function ?

<div class="container  something-else">
  <article class="card">
      <header class="card-header"> My Orders / Tracking </header>
      <div class="card-body">
          <h6>Order ID: <%= order._id %>  </h6>
          <article class="card">
              <div class="card-body row">
                  <div class="col"> <strong>Estimated Delivery time:</strong> <br>29 nov 2019 </div>
                  <div class="col"> <strong>Shipping BY:</strong> <br> BLUEDART, | <i class="fa fa-phone"></i> +1598675986 </div>
                  <% if  (order.orderStatus == 'Cancellede') { %>
                    <div class="col text-danger"> <strong>Status:</strong> <br> <%=order.orderStatus%> </div>
                  <% } else { %>   

                  <div class="col"> <strong>Status:</strong> <br> <%=order.orderStatus%> </div>
                  <%}%>

                  <div class="col"> <strong>Tracking #:</strong> <br> BD045903594059 </div>
              </div>
          </article>
          
          <% if (order.track == 'Cancellede') { %>
            <div class="track">
              <div class="step"> <span class="icon"> <i class="fa fa-check"></i> </span> <span class="text-danger">Order Cancelled</span> </div>
              <div class="step"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text"> Picked by courier</span> </div>
              <div class="step "> <span class="icon"> <i class="fa fa-truck"></i> </span> <span class="text"> On the way </span> </div>
              <div class="step"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text">Ready for pickup</span> </div>
          </div>
           <% }else if(order.track == 'Order Placed'){%>
            <div class="track">
              <div class="step active"> <span class="icon"> <i class="fa fa-check"></i> </span> <span class="text">Order confirmed</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text"> Picked by courier</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-truck"></i> </span> <span class="text"> On the way </span> </div>
              <div class="step"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text">Ready for pickup</span> </div>
          </div>
           <%}else if(order.track == 'Shipped'){ %>
          <div class="track">
              <div class="step active"> <span class="icon"> <i class="fa fa-check"></i> </span> <span class="text">Order confirmed</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text"> Picked by courier</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-truck"></i> </span> <span class="text"> On the way </span> </div>
              <div class="step"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text">Ready for pickup</span> </div>
          </div>

          <% }else if (order.track == 'Deliverd'){ %>
            <div class="track">
              <div class="step active"> <span class="icon"> <i class="fa fa-check"></i> </span> <span class="text">Order confirmed</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text"> Picked by courier</span> </div>
              <div class="step active"> <span class="icon"> <i class="fa fa-truck"></i> </span> <span class="text"> On the way </span> </div>
              <div class="step"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text">Ready for pickup</span> </div>
          </div>
            <% } %> 
          <hr>
          <ul class="row">
              <li class="col-md-4">
                  <figure class="itemside mb-3">
                      <div class="aside"><img src="https://i.imgur.com/iDwDQ4o.png" class="img-sm border"></div>
                      <figcaption class="info align-self-center">
                          <p class="title">Dell Laptop with 500GB HDD <br> 8GB RAM</p> <span class="text-muted">$950 </span>
                      </figcaption>
                  </figure>
              </li>
              <li class="col-md-4">
                  <figure class="itemside mb-3">
                      <div class="aside"><img src="https://i.imgur.com/tVBy5Q0.png" class="img-sm border"></div>
                      <figcaption class="info align-self-center">
                          <p class="title">HP Laptop with 500GB HDD <br> 8GB RAM</p> <span class="text-muted">$850 </span>
                      </figcaption>
                  </figure>
              </li>
              <li class="col-md-4">
                  <figure class="itemside mb-3">
                      <div class="aside"><img src="https://i.imgur.com/Bd56jKH.png" class="img-sm border"></div>
                      <figcaption class="info align-self-center">
                          <p class="title">ACER Laptop with 500GB HDD <br> 8GB RAM</p> <span class="text-muted">$650 </span>
                      </figcaption>
                  </figure>
              </li>
          </ul>
          <hr>
          <a href="#" class="btn btn-warning" data-abc="true"> <i class="fa fa-chevron-left"></i> Back to orders</a>
      </div>
  </article>
</div>




const address = {firstName:req.body.firstName,
    //   lastName:req.body.lastName,
    //   number:req.body.number,
    //   homeaddress:req.body.homeaddress,
    //   city:req.body.city,
    //   district:req.body.city,
    //   country: req.body.country,
    //   zipcode:req.body.zipcode};