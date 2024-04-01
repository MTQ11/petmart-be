const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService")

const getAllOrder = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalItem = await Order.countDocuments()
      const totalPage = Math.ceil(totalItem / limit)
      if (page + 1 > totalPage) {
        resolve({
          status: "ERR",
          message: "This page is not available",
        })
      }
      const data = await Order.find().limit(limit).skip(limit * page).exec()
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

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, user, isPaid, paidAt, shippingAddress } = newOrder;
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
          if (productData.countInStock === 0) {
            // Cập nhật trạng thái của sản phẩm thành "out of stock" nếu countInStock giảm xuống 0
            await Product.findByIdAndUpdate(order.product, { status: 'out of stock' });
          }
          return {
            status: 'OK',
            message: 'SUCCESS'
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
        // Nếu mọi thứ đều ổn, tạo đơn hàng mới
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

        resolve({
          status: 'OK',
          message: 'Đơn hàng đã được tạo thành công',
          data: createdOrder,
        });
      }
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
      // console.log('e', e)
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
      // console.log('e', e)
      reject(e);
    }
  });
};

const cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm order dựa trên ID
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

module.exports = {
  getAllOrder,
  createOrder,
  getOrderDetails,
  getAllOrderDetails,
  cancelOrder,
};
