const mongoose = require('mongoose');
const Product = require('./ProductModel');

const receiptSchema = new mongoose.Schema({
    receiptItems: [
        {
            name: { type: String},
            unit: { type: String},
            type: { type: String},
            image: { type: String },
            amount: { type: Number, required: true},
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            isNewProduct: { type: Boolean, default: false },
        },
    ],
    receivedFrom: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: Number, required: true },
        note: { type: String },
    },
    totalPrice: { type: Number, required: true },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receivedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

receiptSchema.methods.createProductFromReceipt = async function() {
    try {
        const newProducts = [];
        for (const item of this.receiptItems) {
            if (item.isNewProduct) {
                const newProduct = new Product({
                    name: item.name,
                    image: item.image,
                    type: item.type,
                    countInStock: 0,
                    unit: item.unit,
                    price: 0,
                    costPrice: item.price,
                    status: 'active',
                    selled: 0,
                    note: '',
                    promotion: null,
                });
                await newProduct.save();
                newProducts.push(newProduct);
            }
        }
        return newProducts;
    } catch (error) {
        throw new Error('Error creating product from receipt: ' + error.message);
    }
};

const Receipt = mongoose.model('Receipt', receiptSchema);
module.exports = Receipt;
