const promotionService = require('../services/PromotionService')
const JwtService = require('../services/JwtService')

const getAll = async (req, res) => {    
    try {
        const {limit, page} = req.query
        const response = await promotionService.getAll(Number(limit) || null, Number(page))
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const createPromotion = async (req, res) => {
    try {
        const { name, startday, endday, discount, note} = req.body
        if(!name || !startday || !endday || !discount){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if(discount < 0) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Number must be non-negative'
            })
        }

        // Kiểm tra startday phải trước endday
        if (startday >= endday) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Start day must be before end day'
            });
        }
        const response = await promotionService.createPromotion(req.body)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updatePromotion = async (req, res) => {
    try {
        const promotionID = req.params.id
        const data = req.body
        if (!promotionID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The promotionID is required'
            })
        }
        const response = await promotionService.updatePromotion(promotionID,data)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}


const deletePromotion = async (req, res) => {    
    try {
        const promotionID = req.params.id
        if (!promotionID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The promotionId is required'

            })
        }
        const request = await promotionService.deletePromotion(promotionID)
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
    createPromotion,
    updatePromotion,
    deletePromotion
}