const  userRouter = require('./UserRouter')
const  productRouter = require('./ProductRouter')
const promotionRouter = require('./PromotionRouter')
const orderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')


const routes = (app) =>{
    app.use('/user',userRouter)
    app.use('/product',productRouter)
    app.use('/promotion',promotionRouter)
    app.use('/order',orderRouter)
    app.use('/payment', PaymentRouter)

}

module.exports = routes