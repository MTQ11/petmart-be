const  userRouter = require('./UserRouter')

const routes = (app) =>{
    app.use('/user',userRouter)
}

module.exports = routes