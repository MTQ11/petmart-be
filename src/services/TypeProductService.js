const TypeProduct = require('../models/TypeProductModel');

const getTypeProducts = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await TypeProduct.aggregate([
                {
                    $lookup: {
                        from: "products", // Tên của collection chứa sản phẩm
                        localField: "_id",
                        foreignField: "type",
                        as: "products"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        productCount: { $size: "$products" } // Đếm số lượng sản phẩm cho mỗi loại
                    }
                }
            ]);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
};


const createTypeProduct = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {name} = body
            const typeProduct = new TypeProduct({ name });
            const data = await typeProduct.save();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
};

const updateTypeProduct = async (body,id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {name} = body
            const data = await TypeProduct.findByIdAndUpdate(id, { name }, { new: true });
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
};

const deleteTypeProduct = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await TypeProduct.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
};

module.exports = {
    getTypeProducts,
    createTypeProduct,
    updateTypeProduct,
    deleteTypeProduct
};