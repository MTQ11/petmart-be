const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const {
  generalAccessToken,
  generalRefreshAccessToken,
} = require("./JwtService");

const getAll = (limit, page, sort, filter, keysearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalItem = await Product.countDocuments();
      let totalPage = Math.ceil(totalItem / limit);
      if (filter) {
        const label = filter[0];
        const escapedValue = filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'i');
        const dataFilter = await Product.find({ [label]: filter[1] });
        let totalItem = dataFilter.length
        let totalPage = Math.ceil(totalItem / limit);
        resolve({
          status: "OK",
          message: "Success",
          data: dataFilter,
          total: dataFilter.length,
          pageCurrent: Number(page + 1),
          totalPage: totalPage,
        });
      }
      if (keysearch) {
        const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'i');
        const dataFilter = await Product.find({
          $or: [
            { name: regex },
            { idProduct: regex }
          ]
        });
        totalItem = dataFilter.length
        resolve({
          status: "OK",
          message: "Success",
          data: dataFilter,
          total: totalItem,
          // pageCurrent: Number(page + 1),
          // totalPage: totalPage,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const dataSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "Success",
          data: dataSort,
          total: totalItem,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalItem / limit),
        });
      }
      if (page + 1 > totalPage) {
        resolve({
          status: "ERR",
          message: "This page is not available",
        });
      }
      const data = await Product.find().limit(limit).skip(limit * page).exec();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: data,
        total: totalItem,
        pageCurrent: Number(page + 1),
        totalPage: totalPage,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    const { idProduct } = data;
    const checkProduct = await Product.findOne({ idProduct });
    try {
      if (checkProduct) {
        resolve({
          status: "ERR",
          message: "ID Product already exists",
        });
      }
      const createProduct = await Product.create({
        ...data,
      });
      if (createProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id }).exec();
      if (!checkProduct) {
        resolve({
          status: "ERR",
          message: "Product not exists",
        });
      }
      const update = await Product.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: update,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = Product.findOne({ _id: id });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const update = await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: update,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAll,
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllType,
};
