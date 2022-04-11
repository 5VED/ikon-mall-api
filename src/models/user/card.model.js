const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
    cardNumber: {
        required: true,
        type: Number
    },
    validThrough: {
        required: true,
        type: String
    },
    CVV: {
        required: true,
        type: Number
    },
    nameOnCard: {
        required: true,
        type: String
    },
    CardNickName: {
        required: true,
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, { versionKey: false });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;