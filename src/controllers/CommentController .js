const commentService = require('../services/CommentService')
const JwtService = require('../services/JwtService')

const getCommentPost = async (req, res) => {    
    try {
        const {post} = req.query
        const response = await commentService.getCommentPost(post)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const createComment = async (req, res) => {
    try {
        const { content } = req.body
        const userId = req.params.user;
        if(!content ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        
        const response = await commentService.createComment(req.body,userId)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateComment = async (req, res) => {
    try {
        const commentID = req.params.id
        const data = req.body
        if (!commentID) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The commentID is required'
            })
        }
        const response = await commentService.updateComment(commentID,data)
        return res.status(200).json(response)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}


const deleteComment = async (req, res) => {    
    try {
        const commentID = req.params.id
        if (!commentID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The commentId is required'

            })
        }
        const request = await commentService.deleteComment(commentID)
        return res.status(200).json(request)
    }
    catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getCommentPost,
    createComment,
    updateComment,
    deleteComment
}