const mongoose = require('mongoose');

const sizeUnitValueSchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sizeunits',
        required: true
    },
    unitValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const SizeUnitValue = mongoose.model('SizeUnitValue', sizeUnitValueSchema);

module.exports = SizeUnitValue;