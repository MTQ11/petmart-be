const express = require("express")
const router = express.Router()
const postController = require('../controllers/PostController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.get('/get-post', postController.getAll)
router.post('/create-post',authMemberMiddleWare, postController.createPost)
router.put('/update-post/:id',authMemberMiddleWare, postController.updatePost)
router.delete('/delete/:id',authMemberMiddleWare, postController.deletePost)

router.post('/comment/:id',authUserMiddleWare, postController.deletePost)
router.put('/comment-update/:id',authUserMiddleWare, postController.deletePost)
router.delete('/comment-delete/:id',authUserMiddleWare, postController.deletePost)

module.exports = router