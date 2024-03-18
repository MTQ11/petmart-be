const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        countInStock: { type: Number, required: true },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        costPrice: { type: Number, required: true },
        status: { type: String, required: true },
        selled: { type: Number },
        note: { type: String },
        promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true } // Sử dụng promotionSchema ở đây
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
