const mongoose = require('mongoose');

const SavingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a goal name'],
        trim: true
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please add a target amount']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Saving', SavingSchema);
