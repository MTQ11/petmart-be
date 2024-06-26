const userService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { avatar, email, password, confirmPassword } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await userService.createUser(req.body)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const request = await userService.loginUser(req.body)
        const { refresh_token, ...newRequest } = request
        if (newRequest.status == "ERR") {
            return res.status(400).json({ newRequest })
        }
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({ newRequest, refresh_token })
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userID = req.params.user
        const data = req.body

        if (!userID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const request = await userService.updateUser(userID, data)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const adminUpdateUser = async (req, res) => {
    try {
        const userID = req.params.user
        const data = req.body

        if (!userID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const request = await userService.adminUpdateUser(userID, data)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.user
        if (!userID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'

            })
        }
        const request = await userService.deleteUser(userID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAll = async (req, res) => {
    try {
        const { limit, page, filter, sort, keysearch } = req.query
        const response = await userService.getAll(Number(limit) || null, Number(page), filter, sort, keysearch)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllCustomer = async (req, res) => {
    try {
        const { limit, page, sort, filter, keysearch } = req.query
        const response = await userService.getAllCustomer(Number(limit) || 0, Number(page) || 0, sort, filter, keysearch)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}
const getAllMember = async (req, res) => {
    try {
        const { limit, page, sort, filter, keysearch } = req.query
        const response = await userService.getAllMember(Number(limit) || 0, Number(page) || 0, sort, filter, keysearch)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getUsersInfo = async (req, res) => {
    try {
        const usersInfo = await userService.getUsersInfo();
        return res.status(200).json(usersInfo);
    } catch (error) {
        return res.status(404).json({
            message: error
        });
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userID = req.params.user
        if (!userID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'

            })
        }
        const request = await userService.getDetailsUser(userID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.cookies.refresh_token
        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    adminUpdateUser,
    deleteUser,
    getAll,
    getAllCustomer,
    getAllMember,
    getDetailsUser,
    refreshToken,
    getUsersInfo
}