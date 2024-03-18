const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['customer', 'member', 'admin'], default: 'customer' },
        information: { 
            name: { type: String },
            avatar: { type: String },
            gender: {type: String},
            phone: { type: Number },
            birthday: { type: Date },
            address: { type: String },
            note: { type: String },
            city: { type: String },
        }
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;