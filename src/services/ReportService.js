const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService");
const Order = require("../models/OrderModel");
const Receipt = require("../models/ReceiptModel");
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const Product = require("../models/ProductModel");
const Comment = require("../models/CommentModel");

const startBox = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalOrder = await Order.countDocuments();
            const totalUser = await User.countDocuments();
            const totalPost = await Post.countDocuments();
            const totalProduct = await Product.countDocuments();
            resolve({
                status: "OK",
                message: "SUCCESS",
                totalOrder: totalOrder,
                totalUser: totalUser,
                totalPost: totalPost,
                totalProduct: totalProduct,
            });
        } catch (error) {
            reject(error);
        }
    })
}

const getRevenueByMonth = async (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const revenueByMonth = [];
            for (let month = 1; month <= 12; month++) {

                const orders = await Order.find({
                    isPaid: true,
                    $expr: {
                        $and: [
                            { $gte: [{ $month: "$paidAt" }, month] },
                            { $lte: [{ $month: "$paidAt" }, month] },
                            { $eq: [{ $year: "$paidAt" }, year] } // Thêm điều kiện so sánh năm
                        ]
                    }
                });

                const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);
                revenueByMonth.push({ month, totalRevenue });
            }
            const totalRevenue = revenueByMonth.reduce((total, monthRevenue) => total + monthRevenue.totalRevenue, 0);

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: revenueByMonth,
                totalRevenue: totalRevenue,
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

const getCapitalByMonth = async (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const capitalByMonth = [];
            for (let month = 1; month <= 12; month++) {

                const receipts = await Receipt.find({
                    $expr: {
                        $and: [
                            { $gte: [{ $month: "$receivedAt" }, month] },
                            { $lte: [{ $month: "$receivedAt" }, month] },
                            { $eq: [{ $year: "$receivedAt" }, year] } // Thêm điều kiện so sánh năm
                        ]
                    }
                });

                const totalCapital = receipts.reduce((total, receipt) => total + receipt.totalPrice, 0);
                capitalByMonth.push({ month, totalCapital });
            }
            const totalCapital = capitalByMonth.reduce((total, monthCapital) => total + monthCapital.totalCapital, 0);

            const totalReceipts = await Receipt.countDocuments();

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: capitalByMonth,
                totalCapital: totalCapital,
                totalReceipts: totalReceipts,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const reportUser = async () => {
    try {
        const allUsers = await User.find({ role: 'customer' });
        let genderReport = { male: 0, female: 0, other: 0 };
        let ageReport = { under20: 0, from20to40: 0, over40: 0 };
        allUsers.forEach(user => {
            if (user.information && user.information.gender) {
                const gender = user.information.gender.toLowerCase();
                if (gender === 'nam') {
                    genderReport.male++;
                } else if (gender === 'nữ') {
                    genderReport.female++;
                } else {
                    genderReport.other++;
                }
            }

            if (user.information && user.information.birthday) {
                const birthYear = new Date(user.information.birthday).getFullYear();
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                if (age < 20) {
                    ageReport.under20++;
                } else if (age >= 20 && age <= 40) {
                    ageReport.from20to40++;
                } else {
                    ageReport.over40++;
                }
            }
        });

        return { genderReport, ageReport };
    } catch (error) {
        console.error('Error in reporting users:', error);
        throw error;
    }
};

const reportPost = async () => {
    try {
        // Lấy tất cả các bình luận từ Comment model và populate thông tin về bài viết (post)
        const comments = await Comment.find().populate('post').select('post');

        // Lấy tất cả các bài đăng từ Post model
        const posts = await Post.find().select('category views');

        // Tổng hợp dữ liệu theo từng chủ đề
        const categoryData = {};

        // Lặp qua các bình luận và tính tổng số lượng bình luận theo chủ đề
        comments.forEach(comment => {
            const category = comment.post.category;
            if (!categoryData[category]) {
                categoryData[category] = { comments: 0, views: 0 };
            }
            categoryData[category].comments++;
        });

        // Lặp qua các bài đăng và tính tổng số lượng lượt xem theo chủ đề
        posts.forEach(post => {
            const category = post.category;
            if (!categoryData[category]) {
                categoryData[category] = { comments: 0, views: 0 };
            }
            categoryData[category].views += post.views;
        });

        // Tạo mảng kết quả theo mẫu yêu cầu
        const result = Object.keys(categoryData).map(category => ({
            category,
            comments: categoryData[category].comments,
            views: categoryData[category].views
        }));

        return result;
    } catch (error) {
        console.error('Error generating post report:', error);
        throw error;
    }
};

const reportProduct = async () => {
    try {
        const result = await Product.aggregate([
            {
                $lookup: {
                    from: 'typeproducts',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'productType'
                }
            },
            {
                $unwind: { path: '$productType', preserveNullAndEmptyArrays: true } // Giữ mảng trống nếu không có sản phẩm
            },
            {
                $group: {
                    _id: '$productType.name', // Nhóm theo tên loại sản phẩm
                    totalSelled: { $sum: { $ifNull: ['$selled', 0] } } // Tính tổng số lượng đã bán của sản phẩm trong loại, với giá trị mặc định là 0 nếu không có 'selled'
                }
            },
            {
                $project: {
                    _id: 0,
                    type: '$_id', // Hiển thị tên loại sản phẩm thay vì id
                    totalSelled: 1
                }
            },
            {
                $sort: { totalSelled: -1 } // Sắp xếp theo số lượng bán giảm dần
            }
        ]);

        // Kiểm tra nếu mảng kết quả trống, trả về một giá trị mặc định
        if (result.length === 0) {
            return [{ type: 'Không có sản phẩm', totalSelled: 0 }];
        }

        return result;
    } catch (error) {
        console.error('Lỗi khi báo cáo sản phẩm:', error);
        throw error;
    }
};

const statisticsRevenue = async (option) => {
    return new Promise(async (resolve, reject) => {
        let startDate, endDate;
        switch (option) {
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date();
                break;
            case 'quarter':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 3);
                endDate = new Date();
                break;
            case 'year':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                endDate = new Date();
                break;
            default:
                resolve({
                    status: "ERR",
                    message: "Invalid option",
                });
        }

        try {
            // Tính tổng doanh thu từ các đơn hàng trong khoảng thời gian đã xác định
            const totalRevenue = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalPrice' }
                    }
                }
            ]);
            const data = { totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0 }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data,
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}


module.exports = {
    getRevenueByMonth,
    getCapitalByMonth,
    startBox,
    reportUser,
    reportPost,
    reportProduct,
    statisticsRevenue
}