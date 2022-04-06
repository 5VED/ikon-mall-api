const { Product } = require("../models/product/product.model");
const { ProductItem } = require("../models/product/productItem.model");
const categoryHelper = require("./category.helper");
const brandHelper = require("./brand.helper");
const { Brand } = require("../models/product/brand.model");
const { ObjectId } = require('mongoose').Types;
const { ProductRating, Category } = require("../models/index");

exports.processDataForUpload = async (data) => {
  try {
    let responseArr = [];
    const products = (await Product.find({}, 'name category').lean().exec()).map(product => { return { ...product, name: product.name.toLowerCase() } });
    const categories = (await Category.find({}, 'name').lean().exec()).map(category => { return { ...category, name: category.name.toLowerCase() } });
    const brands = (await Brand.find({}, 'name').lean().exec()).map(brand => { return { ...brand, name: brand.name.toLowerCase() } });
    for (const item of data) {
      try {
        //check if category exist
        const category = categories.find(el => el.name === item.Category.toLowerCase());
        if (!category) {
          const newCategory = await categoryHelper.addCategory(item.Category);
          categories.push({ _id: newCategory._id, name: newCategory.name.toLowerCase() });
        }

        //check if brand exist
        const brand = brands.find(brandElem => brandElem.name === item.Brand.toLowerCase());
        if (!brand) {
          const newBrand = await brandHelper.addBrand(item.Brand);
          brands.push({ _id: newBrand._id, name: newBrand.name.toLowerCase() });
        }

        //check if product exist
        const categoryId = category ? category._id : categories.find(el => el.name === item.Category.toLowerCase())._id;
        const product = products.find(productEl => productEl.name === item.ProductName.toLowerCase() && productEl.category.toString() === categoryId.toString());
        if (!product) {
          const newProduct = await this.addProduct(item.ProductName, categoryId);
          products.push({ _id: newProduct._id, name: newProduct.name.toLowerCase(), category: categoryId });
        }

        const brandId = brand ? brand._id : brands.find(el => el.name === item.Brand.toLowerCase())._id;
        const productId = product ? product._id : products.find(productElement => productElement.name === item.ProductName.toLowerCase() && productElement.category.toString() === categoryId.toString())._id;
        const productItem = await ProductItem.findOne(
          {
            color: item.Color,
            size: item.Size,
            brand: brandId.toString(),
            product: productId.toString(),
            shop: item.Shop,
            name: item.ProductItemName
          }
        ).exec();
        if (productItem) {
          const updatedDoc = await ProductItem.findByIdAndUpdate(
            productItem._id,
            {
              $set: {
                sellerPrice: parseFloat(item.SellerPrice),
                costPrice: parseFloat(item.CostPrice),
                mrp: parseFloat(item.Mrp),
                dateModified: Date.now(),
                quantity: item.Quantity
              }
            }
          );
          responseArr.push({ action: 'updated', name: updatedDoc.name, _id: updatedDoc._id });
        } else {
          const newProductItem = new ProductItem({
            name: item.ProductItemName,
            color: item.Color,
            size: item.Size,
            sellerPrice: parseFloat(item.SellerPrice),
            costPrice: parseFloat(item.CostPrice),
            mrp: parseFloat(item.Mrp),
            quantity: item.Quantity,
            brand: brandId,
            product: productId,
            vendor: item.Vendor,
            shop: item.Shop
          });
          const result = await newProductItem.save();
          responseArr.push({ action: 'inserted', name: result.name, _id: result._id });
        }
      } catch (error) {
        responseArr.push({ action: 'error', name: item.ProductItemName, _id: '-' });
      }
    }
    return responseArr;
  } catch (error) {
    console.log(error);
  }
};

exports.addProduct = async (productName, categoryId) => {
  const product = new Product({
    name: productName,
    category: categoryId,
  });
  return product.save();
};

exports.getProductItemAndProduct = async () => {
  let productItem = await ProductItem.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product_info",
      },
    },
    {
      $unwind: "$product_info",
    },
    {
      $lookup: {
        from: "categories",
        localField: "product_info.category",
        foreignField: "_id",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand_info",
      },
    },
    {
      $unwind: "$brand_info",
    },
  ]);

  productItem = productItem.map((item) => {
    item.images = item.images.map((element) => {
      element =
        "https://icon-mall.herokuapp.com/uploads/products/" +
        item.product +
        "/" +
        item._id +
        "/" +
        element;
      return element;
    });
    return item;
  });
  return productItem;
};

exports.getProductItemsWithFilters = async (payload) => {
  let query = {
    '$and': [],
    '$or': []
  };
  let sortquery = {};

  // sort
  if (payload.sort) {
    switch (payload.sortBy) {
      case 'LOWTOHIGH':
        sortquery['$sort'] = { 'sellerPrice': 1 };
        break;
      case 'HIGHTOLOW':
        sortquery['$sort'] = { 'sellerPrice': -1 };
        break;
      case 'NEWESTFIRST':
        sortquery['$sort'] = { 'dateModified': -1 };
        break;
      case 'RECOMMENDED':
        sortquery['$sort'] = { 'recommended': -1 };
        break;
      case 'POPULARITY':
        sortquery['$sort'] = { 'rating': -1 };
        break;
      default:
        sortquery = {};
        break;
    }
  }

  // filter by price range
  if (payload.minPrice && payload.maxPrice) {
    query['$and'].push({ 'sellerPrice': { '$gt': Number(payload.minPrice) } });
    query['$and'].push({ 'sellerPrice': { '$lt': Number(payload.maxPrice) } });
  }

  //filter by brands
  if (payload.brands) {
    query['$and'].push({ 'brand': { '$in': payload.brands.map(brand => { return ObjectId(brand) }) } })
  }

  let aggregateQuery = [
    {
      '$match': { 'shop': ObjectId(payload.shop) }
    }
  ];

  //search 
  if (payload.search) {
    aggregateQuery.push({
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'Brand'
      }
    })
    aggregateQuery.push({ $unwind: "$Brand" });
    query['$or'].push({ 'name': { '$regex': `^${payload.search}$`, '$options': '$i' } });
    query['$or'].push({ 'Brand.name': { '$regex': `^${payload.search}$`, '$options': '$i' } });
    query['$or'].push({ 'description': { '$regex': payload.search, '$options': '$i' } })
  }

  // to check if any operator is null
  Object.keys(query).forEach(operator => {
    if (Object.keys(query[operator]).length === 0) {
      delete query[operator];
    }
  })

  if (Object.keys(query).length > 0) {
    aggregateQuery.push({ '$match': query });
  }

  if (payload.userId) {
    aggregateQuery.push({
      '$lookup': {
        'from': "wishlists",
        'let': { 'productItemId': '$_id', 'userId': ObjectId(payload.userId) },
        'pipeline': [
          { '$match': { '$expr': { '$eq': ['$userId', '$$userId'] } } },
          { '$unwind': '$likedItems' },
          { '$match': { '$expr': { '$eq': ['$likedItems.productItemId', '$$productItemId'] } } }
        ],
        'as': "wishlist"
      }
    });
    aggregateQuery.push({
      '$addFields': {
        'isLiked': {
          '$cond': {
            'if': {
              '$gt': [{ '$size': "$wishlist" }, 0]
            },
            'then': true,
            'else': false
          }
        }
      }
    });
    aggregateQuery.push({
      '$project': {
        'wishlist': 0
      }
    })
  } else {
    aggregateQuery.push({ '$addFields': { 'isLiked': false } });
  }

  if (Object.keys(sortquery).length > 0) {
    aggregateQuery = [...aggregateQuery, sortquery];
  }
  return ProductItem.aggregate(aggregateQuery).skip(Number(payload.skip)).limit(Number(payload.limit)).exec();
}

exports.getProductItemsByShopAndCategory = async (params) => {
  const { shopId, categoryId, search, skip, limit, userId } = params;
  const brands = params.brands ? params.brands : [];
  const query = [
    {
      '$match': { 'shop': ObjectId(shopId) }
    },
    {
      '$lookup': {
        'from': 'products',
        'localField': 'product',
        'foreignField': '_id',
        'as': 'PRODUCT'
      }
    },
    {
      '$unwind': '$PRODUCT'
    },
    {
      '$addFields': {
        'CATEGORY': '$PRODUCT.category'
      }
    },
    {
      '$project': { 'PRODUCT': 0 }
    }
  ];
  if (categoryId && brands && brands.length && brands.length > 0) {
    query.push({
      '$match': {
        'CATEGORY': ObjectId(categoryId),
        'brand': {
          '$in': brands.map(brand => { return ObjectId(brand) })
        }
      }
    });
  } else if (categoryId) {
    query.push({
      '$match': {
        'CATEGORY': ObjectId(categoryId)
      }
    });
  } else if (brands && brands.length && brands.length > 0) {
    query.push({
      '$match': {
        'brand': {
          '$in': brands.map(brand => { return ObjectId(brand) })
        }
      }
    });
  }
  if (search) {
    query.push({ '$match': { 'name': { '$regex': `^${search}$`, '$options': '$i' } } })
  }
  if (userId) {
    query.push({
      '$lookup': {
        'from': "wishlists",
        'let': { 'productItemId': '$_id', 'userId': ObjectId(userId) },
        'pipeline': [
          { '$match': { '$expr': { '$eq': ['$userId', '$$userId'] } } },
          { '$unwind': '$likedItems' },
          { '$match': { '$expr': { '$eq': ['$likedItems.productItemId', '$$productItemId'] } } }
        ],
        as: "wishlist"
      }
    });
    query.push({
      '$addFields': {
        'isLiked': {
          '$cond': {
            'if': {
              '$gt': [{ '$size': "$wishlist" }, 0]
            },
            'then': true,
            'else': false
          }
        }
      }
    });
    query.push({
      '$project': {
        'wishlist': 0
      }
    });
  } else {
    query.push({ '$addFields': { 'isLiked': false } });
  }
  return ProductItem.aggregate(query).skip(Number(skip)).limit(Number(limit)).exec();
}

exports.rateProduct = async (payload) => {
  const { productItemId, userId, star } = payload;
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
  const result = await ProductRating.findOneAndUpdate(
    { productItemId: productItemId.toString() },
    { '$push': rating },
    { 'upsert': true }
  ).exec();
  // update rating in product items
  const ratings = await this.getProductItemRatingsByProductItemId(productItemId);
  const numerator = (1 * ratings[0]['1'] + 2 * ratings[0]['2'] + 3 * ratings[0]['3'] + 4 * ratings[0]['4'] + 5 * ratings[0]['5']);
  const denominator = (ratings[0]['1'] + ratings[0]['2'] + ratings[0]['3'] + ratings[0]['4'] + ratings[0]['5']);
  const weightedAverage = Math.round((numerator / denominator) * 10) / 10;
  await ProductItem.findByIdAndUpdate(productItemId, { '$set': { rating: weightedAverage } }).exec();
  return result;
}

exports.getProductItemRatingsByProductItemId = async (productItemId) => {
  const query = [
    {
      '$match': { productItemId: ObjectId(productItemId) }
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
  return ProductRating.aggregate(query).limit(1).exec();
}

// get product items by shop group by category
exports.getProductItemsByShop = async (params) => {
  let sort = {};
  const { shopId, userId, sortBy, skip, limit } = params;
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
                'let': { 'productItemId': '$_id', 'userId': ObjectId(userId) },
                'pipeline': [
                  { '$match': { '$expr': { '$eq': ['$userId', '$$userId'] } } },
                  { '$unwind': '$likedItems' },
                  { '$match': { '$expr': { '$eq': ['$likedItems.productItemId', '$$productItemId'] } } }
                ],
                'as': "wishlist"
              }
            },
            {
              '$addFields': {
                'isLiked': {
                  '$cond': {
                    'if': {
                      '$gt': [{ '$size': "$wishlist" }, 0]
                    },
                    'then': true,
                    'else': false
                  }
                }
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