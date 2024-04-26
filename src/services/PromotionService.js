const Promotion = require("../models/PromotionModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService")

const getAll = (limit, page, keysearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalItem = await Promotion.countDocuments()
            let totalPage = Math.ceil(totalItem / limit)
            if (keysearch) {
                const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedValue, 'i');
                const dataFilter = await Promotion.find({ name: regex });
                totalItem = dataFilter.length;
                resolve({
                    status: "OK",
                    message: "Success",
                    data: dataFilter,
                    total: totalItem,
                    pageCurrent: 1,
                    totalPage: 1,
                });
            }

            if (page + 1 > totalPage) {
                resolve({
                    status: "ERR",
                    message: "This page is not available",
                })
            }
            const data = await Promotion.find().limit(limit).skip(limit * page).exec()
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
            console.log(e)
        }
    })
}

const createPromotion = (data) => {
    return new Promise(async (resolve, reject) => {
        const { name, startday, endday, discount, note } = data
        const checkPromotion = await Promotion.findOne({ name })
        try {
            if (checkPromotion) {
                resolve({
                    status: "ERR",
                    message: "Promotion already exists"
                })
            }
            const createPromotion = await Promotion.create({
                ...data
            })
            if (createPromotion) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createPromotion
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updatePromotion = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPromotion = await Promotion.findOne({ _id: id }).exec()
            if (!checkPromotion) {
                resolve({
                    status: "ERR",
                    message: "Promotion not exists"
                })
            }
            const update = await Promotion.findByIdAndUpdate(id, data, { new: true })
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

const deletePromotion = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPromotion = Promotion.findOne({ _id: id })
            if (checkPromotion === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const update = await Promotion.findByIdAndDelete(id)
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
    createPromotion,
    updatePromotion,
    deletePromotion
}