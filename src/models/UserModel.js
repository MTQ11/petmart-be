const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        role: {type: String},
        name: { type: String},
        address: { type: String},
        phone: {type: String}
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;