const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { avatar, email, password, confirmPassword } = newUser
        const hash = bcrypt.hashSync(password, 10)
        const checkEmail = await User.findOne({ email: email })
        try {
            if (checkEmail !== null) {
                resolve({
                    status: "OK",
                    message: "That email already, change email"
                })
            }
            const createUser = await User.create({
                avatar,
                email,
                password: hash,
                confirmPassword: hash
            })
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createUser
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}


const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        const checkUser = await User.findOne({ email: email })
        try {
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "That user not exits"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "OK",
                    message: "The password or email is incorrect"
                })
            }
            const access_token = await generalAccessToken({id: checkUser.id})
            const refresh_token = await generalRefreshAccessToken({id: checkUser.id})
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser
}