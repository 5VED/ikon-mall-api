const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

const addressSchema = new Schema({
    addressName: String,
    isOther: {
        type: Boolean,
        default: false
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: String,
    zipcode: {
        type: Number,
        required: true
    },
    city: String,
    state: String,
    country: String,
    location: {
        type: locationSchema,
        required: true,
        index: '2dsphere'
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

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;