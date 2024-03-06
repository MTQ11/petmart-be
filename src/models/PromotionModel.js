const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: { type: String },
    startday: { type: Date },
    endday: { type: Date },
    discount: { type: Number },
    note: { type: String }
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
