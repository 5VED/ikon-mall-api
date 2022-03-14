const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    likedItems: [
        {
            productItemId: {
                type: Schema.Types.ObjectId,
                ref: 'productItem'
            },
            wishlistedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    likedShops: [
        {
            shop: {
                type: Schema.Types.ObjectId,
                ref: 'Shop'
            },
            wishlistedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;