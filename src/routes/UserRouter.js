const express = require("express")
const router = express.Router()
const userController = require('../controllers/UserController')
const { authAdminMiddleWare, authUserMiddleWare, authMemberMiddleWare } = require("../middleware/authMiddleware")

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:user',authUserMiddleWare, userController.updateUser)
router.delete('/delete/:user', authAdminMiddleWare, userController.deleteUser)
router.get('/getUser',authAdminMiddleWare, userController.getAll)
router.get('/get-detail/:user',authUserMiddleWare, userController.getDetailsUser)
router.post('/refresh-token', userController.refreshToken)
module.exports = router