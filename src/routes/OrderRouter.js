const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware");

router.get('/get-all',authMemberMiddleWare, OrderController.getAllOrder)
router.post('/create/:user', authUserMiddleWare, OrderController.createOrder)
router.get('/get-order-user/:user',authUserMiddleWare, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:user/:id',authUserMiddleWare, OrderController.cancelOrder)


module.exports = router