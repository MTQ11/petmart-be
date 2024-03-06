const express = require("express")
const router = express.Router()
const productController = require('../controllers/ProductController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-product', productController.getAll)
router.get('/create-product', productController.createProduct)
router.put('/update-product/:id', productController.updateProduct)
router.get('/get-detail-product/:id', productController.getDetailProduct)
router.delete('/delete/:id', authMemberMiddleWare, productController.deleteProduct)

module.exports = router