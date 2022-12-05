const OrderSchema = require("../models/oderModel")


module.exports={
    getTracking:async(req,res)=>{
        try {
            let user = req.session.user;
            let orderId = req.query.id
         
            let order = await OrderSchema.findById({_id:orderId})
          res.render('user/orderTraking',{user,order})
        } catch (err) {
            app.use((req,res)=>{
                res.status(429).render('admin/error-429')
              })
        }
    }
}