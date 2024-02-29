const express = require("express")
const router = express.Router()
const typeProductController = require('../controllers/TypeProductController')
const { authAdminMiddleWare, authUserMiddleWare, authManageMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-type-product', typeProductController.getAll)
router.get('/create-type-product',authManageMiddleWare, typeProductController.createTypeProduct)
router.put('/update-type-product/:id',authManageMiddleWare, typeProductController.updateTypeProduct)
router.delete('/delete/:id', authManageMiddleWare, typeProductController.deleteTypeProduct)

module.exports = router