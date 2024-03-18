const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;
            
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
                    shippingAddress: { fullName, address, city, phone },
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
                    message: 'Đơn hàng đã được tạo thành công'
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

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;

      if (newData) {
        resolve({
          status: "ERR",
          message: `San pham voi id: ${newData} khong ton tai`,
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrderDetails,
  cancelOrderDetails,
};
