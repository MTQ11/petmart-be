const reportService = require('../services/ReportService')
const JwtService = require('../services/JwtService')

const getRevenueByMonth = async (req, res)=>{
    const {year} = req.query
    try {
        const response = await reportService.getRevenueByMonth(year)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getCapitalByMonth = async (req, res)=>{
    const {year} = req.query
    try {
        const response = await reportService.getCapitalByMonth(year)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const startBox = async (req, res)=>{
    try {
        const response = await reportService.startBox()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const reportUser = async (req, res)=>{
    try {
        const response = await reportService.reportUser()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const reportPost = async (req, res)=>{
    try {
        const response = await reportService.reportPost()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const reportProduct = async (req, res)=>{
    try {
        const response = await reportService.reportProduct()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getRevenueByMonth,
    getCapitalByMonth,
    startBox,
    reportUser,
    reportPost,
    reportProduct
}