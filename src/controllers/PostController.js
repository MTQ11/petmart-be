const postService = require('../services/PostService')
const JwtService = require('../services/JwtService')

const getAll = async (req, res) => {    
    try {
        const {limit, page} = req.query
        const response = await postService.getAll(Number(limit) || null, Number(page))
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const createPost = async (req, res) => {
    try {
        const { title, sections } = req.body
        if(!title || !sections ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await postService.createPost(req.body)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getDetailPost = async (req, res) => {    
    try {
        const postId = req.params.id
        if (!postId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The post is required'

            })
        }
        const request = await postService.getDetailPost(postId)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const postID = req.params.id
        const data = req.body
        if (!postID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The postID is required'
            })
        }
        const response = await postService.updatePost(postID,data)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}


const deletePost = async (req, res) => {    
    try {
        const postID = req.params.id
        if (!postID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The postId is required'

            })
        }
        const request = await postService.deletePost(postID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getAll,
    getDetailPost,
    createPost,
    updatePost,
    deletePost
}