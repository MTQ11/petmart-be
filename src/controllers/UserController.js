const userService = require('../services/UserService')

const createUser = async (req, res) =>{
    try{
        console.log('request:', req.body)
        const res = await userService.createUser
        return res.status(200).json(res)
    }
    catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser
}