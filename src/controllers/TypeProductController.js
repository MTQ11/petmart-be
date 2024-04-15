const typeProductService = require('../services/TypeProductService')
const JwtService = require('../services/JwtService')

const getTypeProduct = async (req, res) => {
    try {
        const response = await typeProductService.getTypeProducts()
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
        if(!name ){
            return res.status(400).json({
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
        const {name} = req.body
        const id = req.params.id
        if(!name ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        
        const response = await typeProductService.updateTypeProduct(req.body,id)
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
        const id = req.params.id
        const response = await typeProductService.deleteTypeProduct(id)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getTypeProduct,
    createTypeProduct,
    updateTypeProduct,
    deleteTypeProduct
}