const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến người dùng tạo bài viết
    comments: [{
        content: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến người dùng tạo bình luận
        createdAt: { type: Date, default: Date.now }
    }] // Mảng các bình luận
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
