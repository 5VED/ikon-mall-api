const { Category } = require('../models/index');
const { ProductItem } = require('../models/product/productItem.model');
const { ObjectId } = require('mongoose').Types;


exports.getAllCategory = async (params) => {
    const { skip, limit } = params;
    return Category.find({}, 'name').skip(skip).limit(limit).exec();
}

exports.getProductItemsbyCategory = async (shopId, sortBy, skip, limit) => {
    let sort = {};
    switch (sortBy) {
        case 'NEWESTFIRST':
            sort['dateModified'] = -1;
            break;
        case 'RECOMMENDED':
            sort['recommended'] = -1;
            break;
        case 'POPULARITY':
            sort['rating'] = -1;
            break;
        default:
            sort['name'] = 1;
            break;
    }
    return Category.aggregate(
        [
            {
                '$lookup': {
                    'from': 'products',
                    'localField': '_id',
                    'foreignField': 'category',
                    'as': 'products_info'
                }
            },
            {
                '$unwind': '$products_info'
            },
            {
                '$group': { '_id': { '_id': "$_id", 'name': "$name" }, 'products': { '$push': "$products_info._id" } }
            },
            {
                '$lookup': {
                    'from': 'productitems',
                    'let': { 'product_ids': '$products' },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$in': ['$product', '$$product_ids'] },
                                        { '$eq': ['$shop', ObjectId(shopId)] }
                                    ]
                                }
                            }
                        },
                        {
                            '$lookup': {
                                'from': "wishlists",
                                'localField': "_id",
                                'foreignField': "likedItems.productItemId",
                                'as': "wishlist"
                            }
                        },
                        {
                            '$addFields': {
                                'isLiked': { '$cond': { 'if': { '$eq': [{ '$size': "$wishlist" }, 0] }, 'then': false, 'else': true } }
                            }
                        },
                        {
                            '$project': {
                                'wishlist': 0
                            }
                        },
                        {
                            '$sort': sort
                        },
                        {
                            '$skip': 0
                        },
                        {
                            '$limit': 10
                        }
                    ],
                    'as': 'productitems_info'
                }
            },
            {
                '$skip': Number(skip)
            },
            {
                '$limit': Number(limit)
            },
            {
                '$match': {
                    'productitems_info': { '$ne': [] }
                }
            },
            {
                '$addFields': {
                    'name': "$_id.name"
                }
            },
            {
                '$project': {
                    'products': 0
                }
            }
        ]
    ).exec();
}

exports.getBrandsByCategory = async (shopId) => {
    return ProductItem.aggregate([
        {
            $match: {
                shop: ObjectId(shopId)
            }
        }, {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "BRAND"
            }
        }, {
            $unwind: "$BRAND"
        }, {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "PRODUCT"
            }
        }, {
            $unwind: "$PRODUCT"
        }, {
            $lookup: {
                from: "categories",
                localField: "PRODUCT.category",
                foreignField: "_id",
                as: "CATEGORY"
            }
        }, {
            $unwind: "$CATEGORY"
        }, {
            $group: {
                _id: { categoryId: "$CATEGORY._id", name: "$CATEGORY.name" },
                brands: { $addToSet: "$BRAND" }
            }
        }
    ]);
}

exports.addCategory = async (categoryName) => {
    const category = new Category({
        name: categoryName
    });
    return category.save();
}