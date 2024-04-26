const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const routes = require("./routes")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const cors = require('cors');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


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