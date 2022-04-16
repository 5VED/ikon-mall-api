const { Brand } = require("../models/product/brand.model");
const { ObjectId } = require("mongoose").Types;

exports.getAllBrands = async (payload) => {
  const { skip, limit } = payload;
  return Brand.find({}).skip(skip).limit(limit).exec();
};

exports.getBrandsByShopAndCategory = async (
  shopId,
  categoryId,
  skip,
  limit
) => {
  const brandQuery = [
    {
      $lookup: {
        from: "productitems",
        let: { brand_id: "$_id", shop_id: ObjectId(shopId) },
        pipeline: [
          {
            $lookup: {
              from: "products",
              let: categoryId
                ? { product_id: "$product", category_id: ObjectId(categoryId) }
                : { product_id: "$product" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$product_id"] },
                        categoryId
                          ? { $eq: ["$category", "$$category_id"] }
                          : {},
                      ],
                    },
                  },
                },
              ],
              as: "Category",
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$brand", "$$brand_id"] },
                  { $eq: ["$shop", "$$shop_id"] },
                  { $gt: [{ $size: "$Category" }, 0] },
                ],
              },
            },
          },
        ],
        as: "Items",
      },
    },
    {
      $match: {
        $expr: {
          $and: [{ $gt: [{ $size: "$Items" }, 0] }],
        },
      },
    },
    {
      $project: {
        name: 1,
        icon: 1,
      },
    },
  ];
  return Brand.aggregate(brandQuery)
    .skip(Number(skip))
    .limit(Number(limit))
    .exec();
};

exports.addBrand = async (payload) => {
  const newBrand = new Brand({
    name: payload.name,
    description: payload.description,
    richDescription: payload.richDescription,
    icon: payload.icon,
    isDeleted: payload.isDeleted,
  });
  console.log("brand===>",newBrand)
  return newBrand.save();
};

exports.getBrand = async (brandId) => {
  return Brand.findById({ _id: brandId }).exec();
};

exports.deleteBrand = async (brandId) => {
  return Brand.updateOne(
    { _id: ObjectId(brandId.toString()) },
    { $set: { isDeleted: true } }
  );
};

exports.modifyBrand = async (brandId, name) => {
  return Brand.updateOne({ _id: brandId }, { $set: { name: name } });
};
