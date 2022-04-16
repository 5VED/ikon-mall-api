const shopHelper = require("../../helper/shop.helper");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");

exports.getShops = async (req, res) => {
  try {
    const result = await shopHelper.getShop(req.query);
    if (result.length === 0) {
      logger.warn("Shop/s not found");
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ data: [], message: "Shop/s not found" });
    }
    logger.info("Shop/s fetched successfully");
    return res
      .status(StatusCodes.OK)
      .send({ data: result, message: "Shop/s fetched successfully" });
  } catch (error) {
    logger.error(`Error in getting Shop/s:: ${error.message}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message, message: "Error in getting Shop/s" });
  }
};

exports.AddShop = async (req, res) => {
  try {
    const payload = req.body;
    const result = await shopHelper.addShop(payload);
     logger.info("Shop added successfully");
    return res
      .status(StatusCodes.OK)
      .send({ data: result, message: "Shop added successfully" });
  } catch (error) {
    logger.error(`Error in adding shop:: ${error.message}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message, message: "Error in adding shop" });
  }
};

exports.RateShop = async (req, res) => {
  try {
    const payload = req.body;
    const result = await shopHelper.rateShop(payload);
    logger.info("Shop rated successfully");
    return res
      .status(StatusCodes.OK)
      .send({ data: result, message: "Shop rated successfully" });
  } catch (error) {
    logger.error(`Error in rating shop:: ${error.message}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message, message: "Error in rating shop" });
  }
};

exports.GetShopRatingsByShopId = async (req, res) => {
  try {
    const shopId = req.query.shopId;
    const result = await shopHelper.getShopRatingsByShopId(shopId);
    logger.info("Shop ratings fetched successfully");
    return res
      .status(StatusCodes.OK)
      .send({ data: result, message: "Shop ratings fetched successfully" });
  } catch (error) {
    logger.error(`Error in getting shop ratings:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in getting shop ratings",
    });
  }
};

exports.EditShop = async (req, res) => {
  try {
    const shop = req.body.shop;
    const shopId = req.params.shopId;
    const result = await shopHelper.editShop(shopId, shop);
    if (!result.matchedCount) {
      logger.warn("shop not found");
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: "shop not found",
      });
    }
    logger.info("Shop updated successfully");
    return res.status(StatusCodes.OK).send({
      data: result,
      message: "Shop updated successfully",
    });
  } catch (error) {
    logger.error(`Error in editing shop:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in editing shop",
    });
  }
};

exports.DeleteShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const result = await shopHelper.deleteShop(shopId);
    if (!result.matchedCount) {
      logger.warn("shop not found");
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: "shop not found",
      });
    }
    logger.info("Shop deleted successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in deleting shop:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in deleting shop",
    });
  }
};

//Returns the shop by its id
exports.getShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const shopData = await shopHelper.getShopData(shopId);
    if (shopData.length === 0 || shopData == null) {
      logger.warn("Shop does not Exist");
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: "Shop does not Exist",
      });
    }
    logger.info("Market data fetched Succesfully");
    return res.status(StatusCodes.OK).json({
      data: shopData,
      message: "Market data fetched Succesfully",
    });
  } catch (error) {
    logger.error(`Error in Getting Shop Data:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in Getting Shop Data",
    });
  }
};

exports.getShopBrands = async (req, res) => {
  try {
    let brands = [];
    const shopId = req.params.shopId;
    const brandList = await shopHelper.getBrandsInShop(shopId);
    brandList.forEach((element) => {
      let temp = {};
      (temp["_id"] = element._id._id), (temp["name"] = element._id.name);
      brands.push(temp);
    });
    if (brandList.length === 0) {
      logger.info("No Branded Products available");
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: "No Branded Products available",
      });
    }
    logger.info("Brands Data Fetched Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: brands, message: "Available Branded Products" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "No Branded Products available",
    });
  }
};
