const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        idProduct: {type: String, required: true, unique: true},
        name: { type: String, required: true },
        image: { type: String},
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeProduct', required: true },
        countInStock: { type: Number, required: true },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        costPrice: { type: Number, required: true },
        status: { type: String, required: true },
        selled: { type: Number },
        note: { type: String },
        promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion'}
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
