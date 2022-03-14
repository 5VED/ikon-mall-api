const { Shop, ShopRating } = require('../models/index');
const { ObjectId } = require('mongoose').Types;

exports.addShop = async (payload) => {
    try {
        const shop = new Shop({
            shopName: payload.shopName,
            desc: payload.desc,
            categoryId: payload.categoryId,
            openTime: payload.openTime,
            closeTime: payload.closeTime,
            rating: payload.rating,
            isPrimeShop: payload.isPrimeShop,
            location: { type: 'Point', coordinates: [payload.lng, payload.lat] },
            shopImage: req.files.shopImage[0].path,
            shopLogo: req.files.shopLogo[0].path
        });
        const result = await shop.save();
        return result;
    } catch (error) {
        throw error;
    }
}

exports.getShop = async (params) => {
    try {
        //new query
        let aggregateQuery = [
            {
                "$match": {
                    "$or": [
                        {
                            "deleted": false
                        },
                        {
                            "deleted": {
                                "$exists": false
                            }
                        }
                    ]
                }
            },
            {
                "$addFields": {
                    onDate: { "$arrayElemAt": ["$timings", new Date().getDay() - 1] },
                }
            }
        ];

        if (params.query) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    "$lookup": {
                        "from": "productitems",
                        "let": {
                            "shopId": "$_id"
                        },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$eq": [
                                            "$shop",
                                            "$$shopId"
                                        ]
                                    }
                                }
                            },
                            {
                                "$lookup": {
                                    "from": "products",
                                    "localField": "product",
                                    "foreignField": "_id",
                                    "as": "Product"
                                }
                            },
                            {
                                "$unwind": "$Product"
                            },
                            {
                                "$lookup": {
                                    "from": "brands",
                                    "localField": "brand",
                                    "foreignField": "_id",
                                    "as": "Brand"
                                }
                            },
                            {
                                "$unwind": "$Brand"
                            },
                            {
                                "$addFields": {
                                    "productName": "$Product.name",
                                    "brandName": "$Brand.name"
                                }
                            },
                            {
                                "$match": {
                                    "$or": [
                                        {
                                            "name": {
                                                "$regex": params.query,
                                                "$options": "$i"
                                            }
                                        },
                                        {
                                            "description": {
                                                "$regex": params.query,
                                                "$options": "$i"
                                            }
                                        },
                                        {
                                            "productName": {
                                                "$regex": params.query,
                                                "$options": "$i"
                                            }
                                        },
                                        {
                                            "brandName": {
                                                "$regex": params.query,
                                                "$options": "$i"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        "as": "ProductItems"
                    }
                },
                {
                    "$match": {
                        "ProductItems": {
                            "$ne": []
                        }
                    }
                },
                {
                    "$project": {
                        "ProductItems": 0
                    }
                }
            ]
        }

        if (params.category) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    "$match": { "categoryId": { "$in": [ObjectId(params.category), "$categoryId"] } }
                }
            ]
        }

        if (params.lat && params.lng) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    "$geoNear": {
                        "near": { "type": "Point", "coordinates": [Number(params.lng), Number(params.lat)] },
                        "distanceField": "dist.calculated",
                        "maxDistance": 5000,
                        "includeLocs": "dist.location",
                        "spherical": true
                    }
                }
            ]
        }

        if (params.time) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    "$match": {
                        "$or": [
                            {
                                "$and": [
                                    { "onDate.open": { "$exists": true } },
                                    { "onDate.close": { "$exists": true } },
                                    { "onDate.open": { "$lte": Number(params.time) } },
                                    { "onDate.close": { "$gte": Number(params.time) } }
                                ]
                            },
                            {
                                "$and": [
                                    { "onDate.open": { "$exists": true } },
                                    { "onDate.close": { "$exists": true } },
                                    { "onDate.open": { "$eq": 0 } },
                                    { "onDate.close": { "$eq": 0 } }
                                ]
                            }
                        ]
                    }
                }
            ]
        }

        if (params.open24hours) {
            aggregateQuery = [
                ...aggregateQuery,
                { $unwind: '$timings' },
                { $match: { 'timings.open': 0, 'timings.close': 0 } },
                { $group: { _id: '$_id', count: { $sum: 1 }, shop: { "$first": "$$CURRENT" } } },
                { $match: { 'count': 7 } },
                { $replaceRoot: { newRoot: "$shop" } }
            ]
        }

        aggregateQuery = [
            ...aggregateQuery,
            {
                "$addFields": {
                    "totalCategory": {
                        "$size": "$categoryId"
                    }
                }
            },
            {
                "$sort": {
                    "totalCategory": -1
                }
            }
        ];

        if (params.userId) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $project: {
                        name: "$shopName",
                        bgImage: "$shopImage",
                        logo: "$shopLogo",
                        location: "$location",
                        rating: "$rating",
                        open:  { $ifNull: [ "$onDate.open", "closed" ]},
                        close: { $ifNull: [ "$onDate.close", "closed" ]},
                        desc: "$desc"
                    }
                },
                {
                    $lookup: {
                      from: "wishlists",
                      let: { 'shopId': '$_id', 'userId': ObjectId(params.userId) },
                      pipeline: [
                        { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
                        { $unwind: '$likedShops' },
                        { $match: { $expr: { $eq: ['$likedShops.shop', '$$shopId'] } } }
                      ],
                      as: "wishlist"
                    }
                },
                {
                    $addFields: {
                      isLiked: {
                        $cond: {
                          if: {
                            $gt: [{ '$size': "$wishlist" }, 0]
                          },
                          then: true,
                          else: false
                        }
                      }
                    }
                },
                {
                    $project: {
                        wishlist: 0
                    }
                }
            ]
        } else {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $project: {
                        name: "$shopName",
                        bgImage: "$shopImage",
                        logo: "$shopLogo",
                        location: "$location",
                        rating: "$rating",
                        open:  { $ifNull: [ "$onDate.open", "closed" ]},
                        close: { $ifNull: [ "$onDate.close", "closed" ]},
                        desc: "$desc",
                        isLiked: "false"
                    }
                }
            ]
            
        }
        const shop = await Shop.aggregate(aggregateQuery).skip(Number(params.skip)).limit(Number(params.limit)).exec();
        return shop;
    } catch (error) {
        throw error;
    }
}

exports.rateShop = async (payload) => {
    try {
        const { shopId, userId, star } = payload;
        let rating = {};
        switch (star) {
            case 1: {
                rating['1'] = { userId: userId };
                break;
            }
            case 2: {
                rating['2'] = { userId: userId };
                break;
            }
            case 3: {
                rating['3'] = { userId: userId };
                break;
            }
            case 4: {
                rating['4'] = { userId: userId };
                break;
            }
            case 5: {
                rating['5'] = { userId: userId };
                break;
            }
            default: {
                break;
            }
        }
        const result = await ShopRating.findOneAndUpdate(
            { shopId: shopId },
            { '$push': rating },
            { 'upsert': true }
        ).exec();
        // update rating in shop
        const ratings = await this.getShopRatingsByShopId(shopId);
        const numerator = (1 * ratings[0]['1'] + 2 * ratings[0]['2'] + 3 * ratings[0]['3'] + 4 * ratings[0]['4'] + 5 * ratings[0]['5']);
        const denominator = (ratings[0]['1'] + ratings[0]['2'] + ratings[0]['3'] + ratings[0]['4'] + ratings[0]['5']);
        const weightedAverage = Math.round((numerator / denominator) * 10) / 10;
        await Shop.findByIdAndUpdate(shopId, { '$set': { rating: weightedAverage } }).exec();
        return result;
    } catch (error) {
        throw error
    }
}

exports.getShopRatingsByShopId = async (shopId) => {
    try {
        const query = [
            {
                '$match': { shopId: ObjectId(shopId) }
            },
            {
                '$project': {
                    '1': { $size: '$1' },
                    '2': { $size: '$2' },
                    '3': { $size: '$3' },
                    '4': { $size: '$4' },
                    '5': { $size: '$5' }
                }
            }
        ];
        const shopRatings = await ShopRating.aggregate(query).limit(1).exec();
        return shopRatings;
    } catch (error) {
        throw error
    }
}

exports.editShop = async (shopId, shop) => {
    try {
        const result = await Shop.findOneAndUpdate(
            { _id: ObjectId(shopId) },
            {
                $set: {
                    shopName: shop.shopName,
                    desc: shop.desc
                }
            }
        ).exec();
        return result;
    } catch (error) {
        throw error;
    }
}

exports.deleteShop = async (shopId) => {
    try {
        const result = await Shop.findByIdAndUpdate(shopId, {
            $set: {
                deleted: true,
                deletedAt: Date.now()
            }
        })
        return result;
    } catch (error) {
        throw error;
    }
}