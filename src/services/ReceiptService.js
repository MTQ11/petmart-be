const Receipt = require("../models/ReceiptModel");
const Product = require("../models/ProductModel");

// const EmailService = require("../services/EmailService")


const createReceipt = async (receiptData) => {
  try {
      const { receiptItems, receivedFrom, receivedBy } = receiptData;
      
      const updatedProducts = [];

      for (const item of receiptItems) {
          if (item.isNewProduct === false) {
              const updatedProduct = await Product.findByIdAndUpdate(
                  item.product,
                  { $inc: { countInStock: + item.amount } },
                  { new: true }
              )
              updatedProducts.push(updatedProduct);
          } else {
              const newProduct = new Product({
                  name: item.name,
                  image: item.image,
                  type: item.type,
                  countInStock: item.amount, 
                  unit: item.unit,
                  price: 0,
                  costPrice: item.price,
                  status: 'active',
                  selled: 0,
                  note: '',
                  promotion: null,
              });
              const savedProduct = await newProduct.save();
              updatedProducts.push(savedProduct);
          }
      }

      const receipt = new Receipt({
          receiptItems,
          receivedFrom,
          receivedBy
      });

      await receipt.save();

      return { receipt, updatedProducts };
  } catch (error) {
      throw new Error('Error creating receipt: ' + error.message);
  }
};

const getAllReceipt = (limit,page) => {
  return new Promise(async (resolve, reject) => {
      try {
          const totalItem = await Receipt.countDocuments()
          const totalPage = Math.ceil(totalItem/limit)
          if(page+1>totalPage){
              resolve({
                  status: "ERR",
                  message: "This page is not available",
              })
          }
          const data = await Receipt.find().limit(limit).skip(limit*page).exec()
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
      // Tìm receipt dựa trên ID
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
        );
        if (!productData) {
          return {
            status: "ERR",
            message: "Product with ID " + item.product + " does not exist or insufficient stock.",
          };
        }
      });

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
