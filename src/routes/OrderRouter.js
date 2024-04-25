const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMemberMiddleWare, authAdminMiddleWare } = require("../middleware/authMiddleware");

router.get('/get-all',authMemberMiddleWare, OrderController.getAllOrder)
router.post('/create/:user', authUserMiddleWare, OrderController.createOrder)
router.get('/get-order-user/:user',authUserMiddleWare, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:user/:id',authUserMiddleWare, OrderController.cancelOrder)
router.delete('/admin-cancel-order/:user/:id',authMemberMiddleWare, OrderController.cancelOrder)
router.get('/admin-get-order-user/:user',authMemberMiddleWare, OrderController.getAllOrderDetails)
router.put('/admin-confirm/:id', authMemberMiddleWare, OrderController.confirmOrder)

module.exports = router