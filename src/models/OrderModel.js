const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [{
        product: {type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: true},
        idProduct: {type: String},
        name: { type: String},
        image: { type: String},
        price: { type: Number},
        discount: { type: Number },
        amount: { type: Number, required: true },
    },],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
},
    {

        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order