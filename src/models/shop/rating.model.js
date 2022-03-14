const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'shops',
        required: true
    },
    5: [{ 
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users'
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
        review: {
            type: String
        },
        ratedAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    4: [{ 
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users'
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
        review: {
            type: String
        },
        ratedAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    3: [{ 
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users'
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
        review: {
            type: String
        },
        ratedAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    2: [{ 
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users'
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
        review: {
            type: String
        },
        ratedAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    1: [{ 
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users'
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'orders'
        },
        review: {
            type: String
        },
        ratedAt: { 
            type: Date,
            default: Date.now 
        }
    }]
}, { versionKey: false });

const ShopRating = mongoose.model('ShopRating', ratingSchema);

module.exports = ShopRating;