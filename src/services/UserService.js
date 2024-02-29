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
                    status: "ERR",
                    message: "That email already, change email"
                })
            }
            const createUser = await User.create({
                avatar,
                email,
                password: hash,
                confirmPassword: hash,
                role: "customer"
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
                    status: "ERR",
                    message: "That user not exits"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "The password or email is incorrect"
                })
            }
            const access_token = await generalAccessToken({ id: checkUser.id, role: checkUser.role })
            const refresh_token = await generalRefreshAccessToken({ id: checkUser.id, role: checkUser.role })
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

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({ _id: id })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({ _id: id })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAll = (limit,page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalItem = await User.countDocuments()
            const totalPage = Math.ceil(totalItem/limit)
            if(page+1>totalPage){
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                })
            }
            const data = await User.find().limit(limit).skip(limit*page).exec()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem,
                pageCurrent: Number(page + 1),
                totalPage: totalPage
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            })
        }
        catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAll,
    getDetailsUser
}