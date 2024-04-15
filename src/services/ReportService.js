const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshAccessToken } = require("./JwtService");
const Order = require("../models/OrderModel");
const Receipt = require("../models/ReceiptModel");
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const Product = require("../models/ProductModel");
const Comment = require("../models/CommentModel");

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
        // Lấy danh sách tất cả người dùng
        const allUsers = await User.find();

        // Khởi tạo biến để lưu kết quả thống kê
        let genderReport = { male: 0, female: 0, other: 0 };
        let ageReport = { under20: 0, from20to40: 0, over40: 0 };

        // Thống kê theo giới tính và độ tuổi
        allUsers.forEach(user => {
            // Thống kê theo giới tính
            if (user.information && user.information.gender) {
                const gender = user.information.gender.toLowerCase();
                if (gender === 'male') {
                    genderReport.male++;
                } else if (gender === 'female') {
                    genderReport.female++;
                } else {
                    genderReport.other++;
                }
            }

            // Thống kê theo độ tuổi
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

// const reportProduct = async () => {
//     try {
//         const result = await Product.aggregate([
//             {
//                 $lookup: {
//                     from: 'typeproducts', // Tên bảng chứa nhóm sản phẩm
//                     localField: 'type', // Trường trong product lưu trữ id tham chiếu tới nhóm sản phẩm
//                     foreignField: '_id', // Trường trong nhóm sản phẩm lưu trữ id nhóm sản phẩm
//                     as: 'productType' // Tên của trường mới trong mảng kết quả, chứa thông tin về nhóm sản phẩm
//                 }
//             },
//             {
//                 $unwind: '$productType' // Bỏ qua mảng và tạo một bản ghi cho mỗi phần tử trong mảng
//             },
//             {
//                 $group: {
//                     _id: '$productType._id', // Nhóm theo id của nhóm sản phẩm
//                     type: { $first: '$productType.name' }, // Lấy tên của nhóm sản phẩm
//                     totalSelled: { $sum: '$selled' } // Tính tổng số lượng đã bán của sản phẩm trong nhóm
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, // Ẩn id nhóm sản phẩm
//                     type: 1, // Hiển thị tên nhóm sản phẩm
//                     totalSelled: 1 // Hiển thị tổng số lượng đã bán
//                 }
//             }
//         ]);
//         return result;
//     } catch (error) {
//         console.error('Error reporting products:', error);
//         throw error;
//     }
// };


module.exports = {
    getRevenueByMonth,
    getCapitalByMonth,
    startBox,
    reportUser,
    reportPost,
    //reportProduct
}