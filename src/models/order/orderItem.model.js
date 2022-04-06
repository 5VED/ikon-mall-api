const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productItem",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    quantity: {
      type: Number,
      min: 1,
    },
    price: {
      type: Number,
    },
    deliveryStatus: {
      type: String,
      enum: ["shipped", "out-for-delivery","confirm"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    }
  },
  { versionKey: false }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
