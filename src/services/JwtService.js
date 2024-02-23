const jwt = require('jsonwebtoken')

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, 'access_token', {expiresIn: '1h'})
    return access_token
}

const generalRefreshAccessToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, 'refresh_token', {expiresIn: '365d'})
    return refresh_token
}

module.exports = {
    generalAccessToken,
    generalRefreshAccessToken
}