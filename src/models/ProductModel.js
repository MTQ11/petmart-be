const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String },
        type: { type: String, required: true },
        countInStock: { type: Number, required: true },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        costPrice: { type: Number, required: true },
        status: { type: String, required: true },
        selled: { type: Number },
        note: { type: String },
        promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' } // Sử dụng promotionSchema ở đây
    },
    {
        timestamps: true,
    }
);

productSchema.pre('updateOne', function(next) {
    const update = this.getUpdate();
    if (update.countInStock === 0) {
        update.status = 'out of stock';
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
