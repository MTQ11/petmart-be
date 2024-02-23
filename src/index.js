const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const routes = require("./routes")
const bodyParser = require("body-parser")
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())

routes(app)


app.get('/',(req,res)=>{
    return res.send("HELLO WORD !!!!!")
})

mongoose.connect(`mongodb+srv://mtquyen1002:11122001@cluster0.lklpo.mongodb.net/`, {serverSelectionTimeoutMS: 3000})
.then(()=>{
    console.log("connect mongodb success")
})
.catch((err)=>{
    console.log(err)
})

app.listen(port,()=>{
    console.log("Sever is running port: ", port)
})