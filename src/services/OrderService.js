const { default: mongoose } = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService")

const getAllOrder = (limit, page, sort, filter, keysearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalItem = await Order.countDocuments();
      let totalPage = Math.ceil(totalItem / limit);
      if (filter) {
        const label = filter[0];
        const escapedValue = filter[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedValue, 'i');
        const dataFilter = await Order.find({ [label]: filter[1] });
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
        let dataFilter;
        if (mongoose.Types.ObjectId.isValid(keysearch)) {
          dataFilter = await Order.find({ '_id': keysearch }); // Tìm theo orderId
        } else {
          const escapedValue = keysearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedValue, 'i');
          dataFilter = await Order.find({
            $or: [
              { 'shippingAddress.fullName': regex }, // Tìm theo fullName
              { 'shippingAddress.phone': regex } // Tìm theo phone
            ]
          });
        }
        let totalItem = dataFilter.length
        let totalPage = Math.ceil(totalItem / limit);
        totalItem = dataFilter.length;
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
        const dataSort = await Order.find()
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
      const data = await Order.find().limit(limit).skip(limit * page).exec();
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
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, shippingAddress, user, isPaid, paidAt, email } = newOrder;

      // Xử lý các promise trong mảng orderItems
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount }
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount
            }
          },
          { new: true }
        );
        if (!productData) {
          // Trả về một object chứa thông tin lỗi
          return {
            status: 'ERR',
            message: 'Sản phẩm không tồn tại hoặc không đủ hàng',
            id: order.product
          };
        } else {
          return {
            status: 'OK',
            message: 'SUCCESS',
            data: productData
          };
        }
      });

      // Chờ tất cả các promise hoàn thành
      const results = await Promise.all(promises);

      // Kiểm tra kết quả của tất cả các promise
      const insufficientProducts = results.filter(result => result.status === 'ERR');
      if (insufficientProducts.length > 0) {
        // Nếu có sản phẩm không đủ hàng, trả về thông báo lỗi
        const insufficientProductIds = insufficientProducts.map(product => product.id).join(', ');
        resolve({
          status: 'ERR',
          message: `Sản phẩm với ID ${insufficientProductIds} không tồn tại hoặc không đủ hàng`
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          isPaid,
          paidAt
        });
        if (createdOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: 'OK',
            message: 'Đơn hàng đã được tạo thành công'
          });
        }

      }
      // resolve({
      //         status: 'OK',
      //         message: 'Đơn hàng đã được tạo thành công'
      // });
    } catch (error) {
      reject(error);
    }
  });
};
const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id);
      if (!order) {
        resolve({
          status: "ERR",
          message: "Order not found",
        });
        return;
      }

      const promises = order.orderItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: item.product,
            selled: { $gte: item.amount }
          },
          {
            $inc: {
              countInStock: +item.amount,
              selled: -item.amount
            }
          },
          { new: true }
        );
        // if (!productData) {
        //   return {
        //     status: "ERR",
        //     message: "Product with ID " + item.product + " does not exist or insufficient stock.",
        //   };
        // }
      });

      const results = await Promise.all(promises);
      const errorResult = results.find(result => result && result.status === "ERR");
      if (errorResult) {
        resolve({
          status: "ERR",
          message: errorResult.message,
        });
      } else {
        await order.deleteOne();
        resolve({
          status: "OK",
          message: "Order deleted successfully",
          data: order,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const confirmOrder = async (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId);
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      resolve({
        status: "OK",
        message: "Order deleted successfully",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  })
};


module.exports = {
  getAllOrder,
  createOrder,
  getOrderDetails,
  getAllOrderDetails,
  cancelOrder,
  confirmOrder
};