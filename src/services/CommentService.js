const Comment = require("../models/CommentModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")
const Post = require("../models/PostModel")
const User = require("../models/UserModel")

const getCommentPost = (post) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Comment.find({ post: post });
            const totalItem = await Comment.countDocuments()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const createComment = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {content, post} = data
            const existingPost = await Post.findById(post);
            if (!existingPost) {
                resolve({
                    status: "ERR",
                    message: "post not exists",
                  });
            }

            const existingUser = await User.findById(userId);
            if (!existingUser) {
                resolve({
                    status: "ERR",
                    message: "user not exists",
                  });
            }

            const createComment = await Comment.create({
                ...data,
                user: userId
            })
            if (createComment) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createComment
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateComment = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkComment = await Comment.findOne({_id: id}).exec()
            console.log("checkComment",checkComment)
            if(!checkComment){
                resolve({
                    status: "ERR",
                    message: "Comment not exists"
                })
            }
            const update = await Comment.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkComment = Comment.findOne({ _id: id })
            if (checkComment === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await Comment.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: update
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getCommentPost,
    createComment,
    updateComment,
    deleteComment
}