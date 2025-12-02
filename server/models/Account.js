const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an account name'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please add an account type (e.g., Bank, Cash, Wallet)'],
        default: 'General'
    },
    balance: {
        type: Number,
        required: [true, 'Please add a balance'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', AccountSchema);
