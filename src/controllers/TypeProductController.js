const typeProductService = require('../services/TypeProductService')
const JwtService = require('../services/JwtService')

const getAll = async (req, res) => {    
    try {
        const response = await typeProductService.getAll()
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const createTypeProduct = async (req, res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await typeProductService.createTypeProduct(req.body)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateTypeProduct = async (req, res) => {
    try {
        const typeProductID = req.params.id
        const data = req.body
        if (!typeProductID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The typeProductID is required'
            })
        }
        const response = await typeProductService.updateTypeProduct(typeProductID,data)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteTypeProduct = async (req, res) => {    
    try {
        const typeProductID = req.params.id
        if (!typeProductID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The typeProductID is required'

            })
        }
        const request = await typeProductService.deleteTypeProduct(typeProductID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getAll,
    createTypeProduct,
    updateTypeProduct,
    deleteTypeProduct
}