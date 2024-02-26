const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/UserModel')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, 'access_token', (err, user) => {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user.role === "admin") {
            console.log('true')
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}


module.exports = {
    authMiddleWare,
}