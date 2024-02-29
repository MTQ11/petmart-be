const  userRouter = require('./UserRouter')
const  productRouter = require('./ProductRouter')
const TypeProduct = require('./TypeProductRouter')

const routes = (app) =>{
    app.use('/user',userRouter)
    app.use('/product',productRouter)
    app.use('/type-product',TypeProduct)
}

module.exports = routes