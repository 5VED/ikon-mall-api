const { Wishlist } = require('../models/index');
const { ObjectId } = require('mongoose').Types;
const { PRODUCT } = require('../../lib/constant');

exports.addToWishlist = async (payload) => {
    try {
        const filter = { 'userId': payload.userId.toString() };
        const update = {
            "$push": payload.type === PRODUCT 
            ? { 'likedItems': { productItemId: payload.productItemId.toString() }}
            : { 'likedShops': { shop: payload.shopId.toString() }},
            "$set": { 'modifiedAt': Date.now() }
        };
        return await Wishlist.findOneAndUpdate(filter, update, { new: true, upsert: true});
    } catch (error) {
        throw error;
    }
}

exports.removeFromWishlist = async (payload) => {
    try {
        const filter = { 'userId': payload.userId.toString() };
        const update = { 
            '$pull': payload.type === PRODUCT 
            ? { 'likedItems': { productItemId: payload.productItemId }}
            : { 'likedShops': { shop: payload.shopId }},
            '$set': { 'modifiedAt': Date.now() }
        };
        const result = await Wishlist.findOneAndUpdate(filter, update, { new: true, upsert: true});
        if (result.likedItems.length === 0 && result.likedShops.length === 0) {
            await Wishlist.deleteOne({ userId: payload.userId.toString() });
        }
        return result;
    } catch (error) {
        throw error;
    }
}

exports.getWishlist = async (userId) => {
    try {
        return await Wishlist.aggregate([
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
            },
            {
                '$project': {
                    'likedItems': 0
                }
            }
        ]).exec();
    } catch (error) {
        throw  error
    }
}