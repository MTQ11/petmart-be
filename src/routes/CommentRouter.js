const express = require("express")
const router = express.Router()
const commentController = require('../controllers/CommentController ')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")


router.get('/get-comment', commentController.getCommentPost)

router.post('/add/:user',authUserMiddleWare, commentController.createComment)
router.put('/update/:user/:id',authUserMiddleWare, commentController.updateComment)
router.delete('/delete/:user/:id',authUserMiddleWare, commentController.deleteComment)

router.post('/admin-add/:user',authMemberMiddleWare, commentController.createComment)
router.put('/admin-update/:id',authMemberMiddleWare, commentController.updateComment)
router.delete('/admin-delete/:id',authMemberMiddleWare, commentController.deleteComment)

module.exports = router