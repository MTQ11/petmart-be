const Post = require("../models/PostModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const getAll = (limit,page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalItem = await Post.countDocuments()
            const totalPage = Math.ceil(totalItem/limit)
            if(page+1>totalPage){
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                })
            }
            const data = await Post.find().limit(limit).skip(limit*page).exec()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
                total: totalItem,
                pageCurrent: Number(page + 1),
                totalPage: totalPage
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const createPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createPost = await Post.create({
                ...data
            })
            if (createPost) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createPost
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const getDetailPost = (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const post = await Post.findOne({ _id: id });
        if (post === null) {
          resolve({
            status: "ERR",
            message: "The post is not defined",
          });
        }
  
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: post,
        });
      } catch (e) {
        reject(e);
      }
    });
  };

const updatePost = (id,data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPost = await Post.findOne({_id: id}).exec()
            console.log("checkPost",checkPost)
            if(!checkPost){
                resolve({
                    status: "ERR",
                    message: "Post not exists"
                })
            }
            const update = await Post.findByIdAndUpdate(id, data, { new: true })
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

const deletePost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPost = Post.findOne({ _id: id })
            if (checkPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await Post.findByIdAndDelete(id)
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
    getAll,
    getDetailPost,
    createPost,
    updatePost,
    deletePost
}