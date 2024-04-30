const Receipt = require("../models/ReceiptModel");
const Product = require("../models/ProductModel");
const { default: mongoose } = require("mongoose");

const createReceipt = async (receiptData) => {
  try {
    const { receiptItems, receivedFrom, receivedBy } = receiptData;
    let totalPrice = 0; // Khởi tạo totalPrice
    const updatedProducts = [];
    for (const item of receiptItems) {
      if (item.isNewProduct === false) {
        const product = await Product.findById(item.product);
        item.name = product.name;
        item.image = product.image;
        item.type = product.type;
        item.unit = product.unit;
        const updatedProduct = await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: { countInStock: item.amount },
            $set: { status: 'available', costPrice: item.price }
          },
          { new: true }
        );
        updatedProducts.push(updatedProduct);
        totalPrice += item.amount * item.price;
      } else {
        const newProduct = new Product({
          name: item.name,
          image: item.image,
          type: item.type,
          countInStock: item.amount,
          unit: item.unit,
          price: 0,
          costPrice: item.price,
          status: 'available', // Đảm bảo sản phẩm mới được tạo có trạng thái là "available"
          selled: 0,
          note: '',
          promotion: null,
        });
        const savedProduct = await newProduct.save();
        updatedProducts.push(savedProduct);
        totalPrice += item.amount * item.price;
      }
    }
    const receipt = new Receipt({
      receiptItems,
      receivedFrom,
      receivedBy,
      totalPrice // Thêm totalPrice vào đối tượng receipt
    });
    await receipt.save();
    return { receipt, updatedProducts };
  } catch (error) {
    throw new Error('Error creating receipt: ' + error.message);
  }
};


const getAllReceipt = (limit, page, sort, filter, keysearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalItem = await Receipt.countDocuments()
      let totalPage = Math.ceil(totalItem / limit)
      if (filter) {
        const label = filter[0];
        const escapedValue = filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'i');
        const dataFilter = await Receipt.find({ [label]: filter[1] });
        let totalItem = dataFilter.length
        let totalPage = Math.ceil(totalItem / limit);
        resolve({
          status: "OK",
          message: "Success",
          data: dataFilter,
          total: dataFilter.length,
          pageCurrent: 1,
          totalPage: 1,
        });
      }
      if (keysearch) {
        let dataFilter;
        if (mongoose.Types.ObjectId.isValid(keysearch)) {
          dataFilter = await Receipt.find({ '_id': keysearch }); // Tìm theo orderId
        } else {
          const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedValue, 'i');
          dataFilter = await Receipt.find({
            $or: [
              { 'receivedFrom.fullName': regex }, // Tìm theo fullName
              { 'receivedFrom.phone': regex } // Tìm theo phone
            ]
          });
        }
        let totalItem = dataFilter.length
        let totalPage = Math.ceil(totalItem / limit);
        resolve({
          status: "OK",
          message: "Success",
          data: dataFilter,
          total: totalItem,
          pageCurrent: Number(page + 1),
          totalPage: totalPage,
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const dataSort = await Receipt.find()
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
        })
      }
      const data = await Receipt.find().limit(limit).skip(limit * page).exec()
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
      reject(e);
    }
  })
}

const getReceiptDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await Receipt.findById({
        _id: id,
      });
      if (receipt === null) {
        resolve({
          status: "ERR",
          message: "The receipt is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: receipt,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllReceiptDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await Receipt.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (receipt === null) {
        resolve({
          status: "ERR",
          message: "The receipt is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: receipt,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteReceipt = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await Receipt.findById(id);
      if (!receipt) {
        resolve({
          status: "ERR",
          message: "Receipt not found",
        });
        return;
      }
      const promises = receipt.receiptItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: item.product,
            countInStock: { $gte: item.amount },
          },
          {
            $inc: { countInStock: -item.amount }
          },
          { new: true }
        )
      })
      const results = await Promise.all(promises);
      const errorResult = results.find(result => result && result.status === "ERR");
      if (errorResult) {
        resolve({
          status: "ERR",
          message: errorResult.message,
        });
      } else {
        await receipt.deleteOne();
        resolve({
          status: "OK",
          message: "Receipt deleted successfully",
          data: receipt,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createReceipt,
  getAllReceipt,
  getReceiptDetails,
  getAllReceiptDetails,
  deleteReceipt,
};
