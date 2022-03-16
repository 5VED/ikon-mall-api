const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
const Shop = mongoose.model( "Shop", new Schema(
    { 
        shopName: {
            type: String,
            required: true
        },
        desc: String,
        categoryId: [{		  
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }],
        openTime: Number,
        closeTime: Number,
        rating: Schema.Types.Decimal128,
        isPrimeShop: Schema.Types.Boolean,
        location: {
            type: locationSchema,
            required: true,
            index: '2dsphere'
        },
        shopImage: String,
        shopLogo: String,
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true
        },
        deleted: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        deletedAt: Date,
        timings: [
            // {
            //     open: Number,
            //     close: Number
            // }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, { versionKey: false })
);

module.exports = Shop;