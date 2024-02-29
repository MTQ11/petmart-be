const TypeProduct = require("../models/TypeProductModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const getAll = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await TypeProduct.find().exec()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const createTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        const {name} = data
        const checkTypeProduct = await TypeProduct.findOne({name})
        try {
            if(checkTypeProduct){
                resolve({
                    status: "ERR",
                    message: "Product already exists"
                })
            }
            const createTypeProduct = await TypeProduct.create({
                ...data
            })
            if (createTypeProduct) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createTypeProduct
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateTypeProduct = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTypeProduct = await TypeProduct.findOne({_id: id}).exec()
            if(!checkTypeProduct){
                resolve({
                    status: "ERR",
                    message: "TypeProduct not exists"
                })
            }
            const update = await TypeProduct.findByIdAndUpdate(id, data, { new: true })
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

const deleteTypeProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTypeProduct = TypeProduct.findOne({ _id: id })
            if (checkTypeProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The type is not defined'
                })
            }
            const update = await TypeProduct.findByIdAndDelete(id)
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

module.exports = {
    getAll,
    createTypeProduct,
    updateTypeProduct,
    deleteTypeProduct
}