const express = require("express")
const router = express.Router()
const promotionController = require('../controllers/PromotionController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-promotion', promotionController.getAll)
router.get('/create-promotion',authMemberMiddleWare, promotionController.createPromotion)
router.put('/update-promotion/:id',authMemberMiddleWare, promotionController.updatePromotion)
router.delete('/delete/:id',authMemberMiddleWare, promotionController.deletePromotion)

module.exports = router