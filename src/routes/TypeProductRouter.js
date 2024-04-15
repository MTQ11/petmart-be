const express = require("express")
const router = express.Router()
const typeProductController = require('../controllers/TypeProductController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")


router.get('/get-type-product', typeProductController.getTypeProduct)
router.post('/create',authMemberMiddleWare, typeProductController.createTypeProduct)
router.put('/update/:id',authMemberMiddleWare, typeProductController.updateTypeProduct)
router.delete('/delete/:id',authMemberMiddleWare, typeProductController.deleteTypeProduct)

module.exports = router