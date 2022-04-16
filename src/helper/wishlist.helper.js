const { Wishlist } = require('../models/index');
const { ObjectId } = require('mongoose').Types;
const { PRODUCT } = require('../../lib/constant');

exports.addToWishlist = async (payload) => {
    const filter = { 'userId': payload.userId.toString() };
    const update = {
        "$push": payload.type === PRODUCT
            ? { 'likedItems': { productItemId: payload.productItemId.toString() } }
            : { 'likedShops': { shop: payload.shopId.toString() } },
        "$set": { 'modifiedAt': Date.now() }
    };
    return Wishlist.findOneAndUpdate(filter, update, { new: true, upsert: true });
}

exports.removeFromWishlist = async (payload) => {
    const filter = { 'userId': payload.userId.toString() };
    const update = {
        '$pull': payload.type === PRODUCT
            ? { 'likedItems': { productItemId: payload.productItemId } }
            : { 'likedShops': { shop: payload.shopId } },
        '$set': { 'modifiedAt': Date.now() }
    };
    const result = await Wishlist.findOneAndUpdate(filter, update);
    if (result.likedItems.length === 0 && result.likedShops.length === 0) {
        await Wishlist.deleteOne({ userId: payload.userId.toString() });
    }
    return result;
}

exports.getWishlist = async (userId) => {
    const data = await Wishlist.aggregate([
        {
            '$match': { userId: ObjectId(userId) }
        },
        {
            '$lookup': {
                'from': 'productitems',
                'localField': 'likedItems.productItemId',
                'foreignField': '_id',
                'as': 'Items'
            }
        }
    ]).exec();

    data[0].likedItems = data[0].likedItems.sort((a, b) => {
        return new Date(b.wishlistedAt) - new Date(a.wishlistedAt);
    })
    data[0].likedItems = data[0].likedItems.map(item => {
        item.productItem = data[0].Items.find(element => {
            return item.productItemId.toString() === element._id.toString();
        })
        return item;
    })
    delete data[0].Items
    return data;
}