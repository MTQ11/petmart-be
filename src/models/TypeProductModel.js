const mongoose = require('mongoose');

const typeProductSchema = new mongoose.Schema({
    name: {type: String,required: true}
});

const TypeProduct = mongoose.model('TypeProduct', typeProductSchema);

module.exports = TypeProduct;
