const express = require("express")
const router = express.Router()
const productController = require('../controllers/ProductController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-product', productController.getAll)
router.post('/create-product', productController.createProduct)
router.put('/update-product/:id', productController.updateProduct)
router.get('/get-detail-product/:id', productController.getDetailProduct)
router.delete('/delete/:id', authAdminMiddleWare, productController.deleteProduct)
router.get('/get-all-type', productController.getAllType)
module.exports = router