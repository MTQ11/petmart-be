const jwt = require('jsonwebtoken')

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, 'access_token', {expiresIn: '30d'})
    return access_token
}

const generalRefreshAccessToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, 'refresh_token', {expiresIn: '365d'})
    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, 'refresh_token', async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authemtication'
                    })
                }
                const access_token = await generalAccessToken({
                    id: user?.id,
                    role: user.role
                })
                resolve({
                    status: 'OK',
                    message: 'SUCESS',
                    access_token
                })
            })
        } catch (e) {   
            reject(e)
        }
    })

}

module.exports = {
    generalAccessToken,
    generalRefreshAccessToken,
    refreshTokenJwtService
}