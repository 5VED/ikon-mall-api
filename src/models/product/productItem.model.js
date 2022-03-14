const mongoose = require("mongoose");

const productItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  mrp: {
    type: Number,
    default: 0,
  },
  sellerPrice: {
    type: Number,
    default: 0,
  },
  costPrice: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
  recommended: {
    type: Number,
    default: 5
  }
});

productItemSchema.virtual("productItemId").get(function () {
  return this._id.toHexString();
});

productItemSchema.set("toJSON", {
  virtuals: true,
});

exports.ProductItem = mongoose.model("productItem", productItemSchema);
