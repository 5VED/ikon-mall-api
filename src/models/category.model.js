const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    richDescription: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
    }
})


categorySchema.virtual('categoryId').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;