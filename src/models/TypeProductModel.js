const mongoose = require('mongoose')

const typeProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);
const TypeProduct = mongoose.model('Type-Product', typeProductSchema);

module.exports = TypeProduct;