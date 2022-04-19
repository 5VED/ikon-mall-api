const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  category: {
    type: String,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const FAQ = new mongoose.model("faqs", faqSchema);

module.exports = FAQ;
