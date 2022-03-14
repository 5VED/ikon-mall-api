const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    productItems: [
        {
            productItemId: { type: Schema.Types.ObjectId, ref: 'productItem'},
            quantity: { type: Number, default: 1 },
            createdAt: { type: Date, default: Date.now },
            modifiedAt: { type: Date, default: Date.now }
        }
    ]
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;