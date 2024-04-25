const OrderService = require('../services/OrderService')

const getAllOrder = async (req, res) => {
    try {
        const {limit, page, sort, filter, keysearch} = req.query
        const response = await OrderService.getAllOrder(Number(limit) || 0, Number(page) || 0, sort, filter, keysearch)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createOrder = async (req, res) => {
    try { 
        const {shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice,  } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.user
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrder = async (req, res) => {    
    try {
        const orderID = req.params.id
        if (!orderID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required'

            })
        }
        const request = await OrderService.cancelOrder(orderID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const confirmOrder = async (req, res) => {    
    try {
        const orderID = req.params.id
        if (!orderID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required'

            })
        }
        const request = await OrderService.confirmOrder(orderID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getAllOrder,
    createOrder,
    getDetailsOrder,
    getAllOrderDetails,
    cancelOrder,
    confirmOrder
}