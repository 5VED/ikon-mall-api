const { Brand } = require('../models/product/brand.model');
const { ObjectId } = require('mongoose').Types;

exports.getAllBrands = async (payload) => {
    try {
        const { skip, limit } = payload;
        const brands = await Brand.find({}).skip(skip).limit(limit).exec();
        return brands;
    } catch (error) {
        throw error;
    }
}

exports.getBrandsByShopAndCategory = async (shopId, categoryId, skip, limit) => {
    try {
        const brandQuery = [
            {
                '$lookup': {
                    'from': "productitems",
                    'let': { 'brand_id': "$_id", 'shop_id': ObjectId(shopId) },
                    'pipeline': [
                        {
                            '$lookup': {
                                'from': "products",
                                'let': categoryId ? { 'product_id': "$product", 'category_id': ObjectId(categoryId) } : { 'product_id': "$product" },
                                'pipeline': [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    { '$eq': ['$_id', '$$product_id'] },
                                                    categoryId ? { '$eq': ['$category', "$$category_id"] } : {}
                                                ]
                                            }
                                        }
                                    }
                                ],
                                'as': "Category"
                            }
                        },
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$eq': ['$brand', '$$brand_id'] },
                                        { '$eq': ['$shop', "$$shop_id"] },
                                        { '$gt': [{ '$size': "$Category" }, 0] }
                                    ]
                                }
                            }
                        },

                    ],
                    'as': "Items"
                }
            },
            {
                '$match': {
                    '$expr': {
                        '$and': [
                            { '$gt': [{ '$size': "$Items" }, 0] }
                        ]
                    }
                }
            },
            {
                '$project': {
                    'name': 1,
                    'icon': 1
                }
            }
        ];
        const brands = await Brand.aggregate(brandQuery).skip(Number(skip)).limit(Number(limit)).exec();
        return brands;
    } catch (error) {
        throw error
    }
}

exports.addBrand = async (brandName) => {
    try {
        const newBrand = new Brand({
            name: brandName
        });
        const savedBrand = await newBrand.save();
        return savedBrand;
    } catch (error) {
        throw error;
    }
}