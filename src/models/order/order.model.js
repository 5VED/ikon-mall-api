const mongoose = require("mongoose");
const { v1: uuidV4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      default: uuidV4(),
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    orderTotal: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "in progress", "completed", "canceled", "rejected"],
    },
  },
  { versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);




module.exports = Order;
