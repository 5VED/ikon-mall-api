const { Cart } = require('../models/index');
const mongoose = require('mongoose');

exports.addToCart = async (payload) => {
    try {
        const filter = { 'userId': payload.userId.toString(), 'productItems.productItemId': payload.productItemId.toString() };
        const itemInCart = await Cart.findOne(filter).lean();
        if(itemInCart) {
            const update = {
                '$inc': { 'productItems.$.quantity': payload.add ? +1 : -1 },
                '$set': { 'productItems.$.modifiedAt': Date.now() }
            };
            return await Cart.findOneAndUpdate(filter, update);
        } else {
            return await Cart.findOneAndUpdate(
                { userId: payload.userId.toString() },
                { $push: { 
                    productItems: { productItemId: payload.productItemId, quantity: 1 }
                }},
                {
                    'new': true,
                    'upsert': true
                }
            );
        }
    } catch (error) {
        throw error;
    }
}

exports.removeFromCart = async (payload) => {
    try {
        const filter = { 'userId': payload.userId.toString(), "productItems.productItemId": payload.productItemId.toString() };
        const update = { '$pull': { 'productItems': { 'productItemId': payload.productItemId }}}
        const result = await Cart.updateOne(filter, update);
        //remove document if product item is empty
        await Cart.deleteOne({ 'userId': payload.userId, 'productItems': { '$size': 0 }});
        return result;
    } catch (error) {
        throw error;
    }
}

exports.autoRemoveAfter30Days = async () => {
    try {
        const date30daysBefore = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        console.log('date30daysBefore', date30daysBefore);
        const outdated = await Cart.aggregate([
            {
                '$match': {
                    "productItems": {
                        '$elemMatch': { 'modifiedAt': { '$lt': date30daysBefore }}
                    }
                }
            },
            {
                '$project': {
                    "productItems_filter": {
                        '$filter': {
                            'input': "$productItems",
                            'as': 'item',
                            'cond': { '$lt': ["$$item.modifiedAt", date30daysBefore] }
                        }
                        
                    },
                    "userId": 1
                }
            }
        ]).exec();
        const itemsToBeRemove = outdated.map(element => { return element.productItems_filter }).flat().map(el => { return el._id});
        const userIds = outdated.map(doc => { return doc.userId });
        const result = await Cart.updateMany(
            //filter
            {
                "productItems._id": { '$in': itemsToBeRemove }
            },
            //update
            {
                '$pull': { 'productItems': { '_id': { '$in': itemsToBeRemove  }} }
            }
        );

        //remove if product items is empty
        await Cart.deleteMany({ "userId": { $in: userIds }, 'productItems': { '$size': 0 }});

        return result;
    } catch (error) {
        throw error;
    }
}

exports.getCartItems = async(userId) => {
    try {
        const query = [
            {
                '$match': {
                    'userId': mongoose.Types.ObjectId(userId)
                }
            },
            {
                '$unwind': '$productItems'
            },
            {
                '$lookup': {
                    'from': 'productitems',
                    'localField': 'productItems.productItemId',
                    'foreignField': '_id',
                    'as': 'item'
                }
            },
            {
                '$unwind': '$item'
            },
            {
                '$project': {
                    'image': { '$arrayElemAt': ['$item.images',0] },
                    'productItemName': '$item.name',
                    'mrp': '$item.mrp',
                    'sellerPrice': '$item.sellerPrice',
                    'costPrice': '$item.costPrice',
                    'quantity': '$productItems.quantity',
                    'productItemId': '$productItems.productItemId'
                }
            }
        ];
        return await Cart.aggregate(query).exec();
    } catch (error) {
        throw error;
    }
}