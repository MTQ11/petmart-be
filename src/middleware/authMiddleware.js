const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authAdminMiddleWare = (req, res, next) => {
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
                message: 'The authemtication admin',
                status: 'ERROR'
            })
        }
        if (user.role === "admin") {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication 2',
                status: 'ERROR'
            })
        }
    });
}

const authMemberMiddleWare = (req, res, next) => {
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
        if (user.role === "member" || user.role === "admin") {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authCustomerMiddleWare = (req, res, next) => {
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
        if (user.role === "manage" || user.role === "customer" || user.role === "admin") {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.user
    jwt.verify(token,'access_token', function (err, user) {
        console.log("user?.id",user?.id)
        if (err) {
            return res.status(404).json({
                message: 'The authemtication user',
                status: 'ERROR'
            })
        }
        if (user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication 2',
                status: 'ERROR'
            })
        }
    });
}



module.exports = {
    authAdminMiddleWare,
    authMemberMiddleWare,
    authUserMiddleWare
}