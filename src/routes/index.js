const  userRouter = require('./UserRouter')
const  productRouter = require('./ProductRouter')

const routes = (app) =>{
    app.use('/user',userRouter)
    app.use('/product',productRouter)
}

module.exports = routes