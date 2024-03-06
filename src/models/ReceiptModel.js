const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receiptItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    receivedFrom: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: Number, required: true },
        note: { type: String },
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
        validate: {
            validator: async function (userId) {
                const user = await this.model('User').findById(userId);
                return user && (user.role === 'member' || user.role === 'admin');
            },
            message: 'Only users with manage or admin role can receive receipts.'
        }
    }, // Người nhận phiếu
    receivedAt: { type: Date, default: Date.now }, // Ngày nhận phiếu
},
    {
        timestamps: true,
    });

const Receipt = mongoose.model('Receipt', receiptSchema);
module.exports = Receipt;
