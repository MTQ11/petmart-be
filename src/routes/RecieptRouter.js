const express = require("express");
const router = express.Router()
const ReceiptController = require('../controllers/ReceiptController');
const { authUserMiddleWare, authMiddleWare, authAdminMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',authAdminMiddleWare, ReceiptController.createReceipt)
router.get('/get-all-receipt',authAdminMiddleWare, ReceiptController.getAllReceipt)
router.get('/get-all-receipt-user/:id',authAdminMiddleWare, ReceiptController.getAllReceiptDetails)
router.get('/get-details-receipt/:id',authAdminMiddleWare, ReceiptController.getDetailsReceipt)
router.delete('/cancel-receipt/:id',authAdminMiddleWare, ReceiptController.deleteReceipt)


module.exports = router