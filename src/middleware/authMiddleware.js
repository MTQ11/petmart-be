const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const tokenHeader = req.headers.token
    if (!tokenHeader) {
        return res.status(401).json({
            message: 'Missing token',
            status: 'ERROR'
        })
    }
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token,'access_token', function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user.role === "admin") {
            next()
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