const mongoose = require("mongoose");

const Otp = mongoose.model("Otp", new mongoose.Schema(
    { otp: Number ,
      phone: String ,
     expiry: String }));

module.exports = Otp;