const { Vendor } = require('../models/vendor.model');

exports.addVendor = async (vendorData) => {
    const vendor = new Vendor({
        firstName: vendorData.firstName,
        lastName: vendorData.lastName,
        email: vendorData.email
    });
    return vendor.save();
}

exports.getAllVendors = async (skip, limit) => {
    return Vendor.find({}, 'vendorId firstName lastName email').skip(skip).limit(limit).exec();
}

exports.getVendorById = async (vendorId) => {
    return Vendor.findById(vendorId);
}