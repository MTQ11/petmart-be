const express = require("express")
const router = express.Router()
const postController = require('../controllers/PostController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-post', postController.getAll)
router.get('/get-detail-post/:id', postController.getDetailPost)
router.post('/create-post',authMemberMiddleWare, postController.createPost)
router.put('/update-post/:id',authMemberMiddleWare, postController.updatePost)
router.delete('/delete/:id',authMemberMiddleWare, postController.deletePost)

module.exports = router