const  userRouter = require('./UserRouter')
const  productRouter = require('./ProductRouter')
const promotionRouter = require('./PromotionRouter')

const routes = (app) =>{
    app.use('/user',userRouter)
    app.use('/product',productRouter)
    app.use('/promotion',promotionRouter)
}

module.exports = routes