const  userRouter = require('./UserRouter')
const  productRouter = require('./ProductRouter')
const promotionRouter = require('./PromotionRouter')
const orderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const recieptRouter = require('./RecieptRouter')
const postRouter = require('./PostRouter')
const commemtRouter = require('./CommentRouter')


const routes = (app) =>{
    app.use('/user',userRouter)
    app.use('/product',productRouter)
    app.use('/promotion',promotionRouter)
    app.use('/order',orderRouter)
    app.use('/payment', PaymentRouter)
    app.use('/post', postRouter)
    app.use('/comment', commemtRouter)
    app.use('/receipt',recieptRouter)
}

module.exports = routes