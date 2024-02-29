const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const getAll = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Product.find().exec()
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

const createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, countInStock, unit, price, costPrice, status, description } = data
        const checkProduct = await Product.findOne({name})
        try {
            if(checkProduct){
                resolve({
                    status: "ERR",
                    message: "Product already exists"
                })
            }
            const createProduct = await Product.create({
                ...data
            })
            if (createProduct) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createProduct
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({_id: id}).exec()
            console.log("checkProduct",checkProduct)
            if(!checkProduct){
                resolve({
                    status: "ERR",
                    message: "Product not exists"
                })
            }
            const update = await Product.findByIdAndUpdate(id, data, { new: true })
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

const getDetailProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: product
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = Product.findOne({ _id: id })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await Product.findByIdAndDelete(id)
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
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct
}