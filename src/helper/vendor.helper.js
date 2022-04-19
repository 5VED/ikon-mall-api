const { Vendor } = require("../models/vendor.model");

exports.addVendor = async (vendorData) => {
  const vendor = new Vendor({
    firstName: vendorData.firstName,
    lastName: vendorData.lastName,
    email: vendorData.email,
    isDeleted: vendorData.isDeleted,
  });
  return vendor.save();
};

exports.getAllVendors = async (skip, limit) => {
  return Vendor.find({}, "vendorId firstName lastName email")
    .skip(skip)
    .limit(limit)
    .exec();
};

exports.getVendorById = async (vendorId) => {
  return Vendor.findById(vendorId);
};

exports.deleteVendor = async (vendorId) => {
  return Vendor.updateOne({ _id: vendorId }, { $set: { isDeleted: true } });
};

exports.modifyVendor = async (vendorId, payload) => {
  payload = { ...payload };
  return Vendor.updateOne({ _id: vendorId }, { $set: payload });
};
