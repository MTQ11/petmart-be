const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sections: [{
        sectionTitle: { type: String, required: true },
        content: { type: String, required: true }
    }],
    category: { type: String },
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
    images: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
    , { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
