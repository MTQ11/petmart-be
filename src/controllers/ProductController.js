const productService = require('../services/ProductService')
const JwtService = require('../services/JwtService')

const getAll = async (req, res) => {    
    try {
        const {limit, page, sort, filter, keysearch} = req.query
        const response = await productService.getAll(Number(limit) || 0, Number(page) || 0, sort, filter, keysearch)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const {idProduct, name, image, type, countInStock, unit, price, costPrice, status } = req.body
        if(!idProduct || !name || !type ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if(countInStock < 0 || price < 0 || costPrice < 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Count in stock, price, and cost price must be non-negative'
            })
        }
        const response = await productService.createProduct(req.body)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productID = req.params.id
        const data = req.body
        if (!productID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productID is required'
            })
        }
        const response = await productService.updateProduct(productID,data)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getDetailProduct = async (req, res) => {    
    try {
        const productID = req.params.id
        if (!productID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'

            })
        }
        const request = await productService.getDetailProduct(productID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteProduct = async (req, res) => {    
    try {
        const productID = req.params.id
        if (!productID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'

            })
        }
        const request = await productService.deleteProduct(productID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await productService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    getAll,
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllType
}