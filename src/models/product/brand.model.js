const { boolean } = require("joi");
const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  richDescription: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

brandSchema.virtual("brandId").get(function () {
  return this._id.toHexString();
});

brandSchema.set("toJSON", {
  virtuals: true,
});

exports.Brand = mongoose.model("Brand", brandSchema);
