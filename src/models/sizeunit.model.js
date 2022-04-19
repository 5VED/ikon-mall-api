const mongoose = require("mongoose");

const sizeUnitSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const SizeUnit = mongoose.model("SizeUnit", sizeUnitSchema);

module.exports = SizeUnit;
