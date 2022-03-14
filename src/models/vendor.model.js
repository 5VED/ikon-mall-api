const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    }
})

vendorSchema.virtual('vendorId').get(function () {
    return this._id.toHexString();
});

vendorSchema.set('toJSON', {
    virtuals: true,
});


exports.Vendor = mongoose.model('Vendor', vendorSchema);
