const express = require("express");
const router = express.Router()
const ReportController = require('../controllers/ReportController');
const { authAdminMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware");
router.get('/get-revenue-month',authMemberMiddleWare, ReportController.getRevenueByMonth)
router.get('/get-capital-month',authMemberMiddleWare, ReportController.getCapitalByMonth)
router.get('/startbox',authMemberMiddleWare, ReportController.startBox)
router.get('/report-user',authMemberMiddleWare, ReportController.reportUser)
router.get('/report-post',authMemberMiddleWare, ReportController.reportPost)
router.get('/report-product',authMemberMiddleWare, ReportController.reportProduct)

module.exports = router