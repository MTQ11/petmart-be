const ReceiptService = require('../services/ReceiptService')

const createReceipt = async (req, res) => {
    try {
        const { receiptItems, receivedFrom, receivedBy } = req.body;
        if (!receivedFrom.fullName || !receivedFrom.address || !receivedFrom.phone || !receivedBy) {
            return res.status(400).json({ error: 'The input is required' });
        }
        for (const item of receiptItems) {
            if (item.amount === undefined || item.price === undefined) {
                return res.status(400).json({ error: 'The input is required' });
            }
        }
        const response = await ReceiptService.createReceipt(req.body)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllReceipt = async (req, res) => {
    try {
        const {limit, page, sort, filter, keysearch} = req.query
        const response = await ReceiptService.getAllReceipt(Number(limit) || 0, Number(page) || 0, sort, filter, keysearch)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsReceipt = async (req, res) => {
    try {
        const receiptId = req.params.id
        if (!receiptId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await ReceiptService.getReceiptDetails(receiptId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllReceiptDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await ReceiptService.getAllReceiptDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteReceipt = async (req, res) => {    
    try {
        const receiptID = req.params.id
        if (!receiptID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The receiptId is required'

            })
        }
        const request = await ReceiptService.deleteReceipt(receiptID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    createReceipt,
    getAllReceipt,
    getDetailsReceipt,
    getAllReceiptDetails,
    deleteReceipt
}