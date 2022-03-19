const { Vendor } = require('../models/vendor.model');

exports.addVendor = async (vendorData) => {
    try {
        const vendor = new Vendor({
            firstName: vendorData.firstName,
            lastName: vendorData.lastName,
            email: vendorData.email
        });
        const result = await vendor.save();
        return result;
    } catch (error) {
        throw error;
    }
}

exports.getAllVendors = async(skip, limit) => {
    try {
        const result = await Vendor.find({}, 'vendorId firstName lastName email').skip(skip).limit(limit).exec();
        return result;
    } catch (error) {
        throw error;
    }
}

exports.getVendorById = async(vendorId) => {
    return Vendor.findById(vendorId);
}