const mongoose = require("mongoose");
const common = require("../../../lib/common");
const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: common.deliveryStatus
    },
    orderStatus: {
      type: String,
      enum: common.orderStatus,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: common.paymentMode,
      required: true,
    },
    transactionId: {
      type: String
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
