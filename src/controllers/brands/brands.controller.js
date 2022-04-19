const brandHelper = require("../../helper/brand.helper");
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require("../../../lib/logger");
const { Brand } = require("../../models/product/brand.model");

exports.getAllBrands = async (req, res) => {
  try {
    const result = await brandHelper.getAllBrands(req.query);
    if (result.length === 0) {
      logger.warn("brands not found");
      return res.status(statusCodes.NOT_FOUND).json({
        data: [],
        message: "brands not found",
      });
    }
    logger.info("Brands fetched successfully");
    return res.status(statusCodes.OK).json({
      data: result,
      message: "Brands fetched successfully",
    });
  } catch (error) {
    logger.error(`Error in getAllBrands:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in getting brands",
    });
  }
};

exports.GetBrandsByShopAndCategory = async (req, res) => {
  try {
    const { shopId, categoryId, skip, limit } = req.query;
    const brands = await brandHelper.getBrandsByShopAndCategory(
      shopId,
      categoryId,
      skip,
      limit
    );
    if (brands.length === 0) {
      logger.warn("Brands by shop and category not found!");
      return res.status(statusCodes.NOT_FOUND).send({
        data: [],
        message: "No brands found by shop and category",
      });
    }
    logger.info("Brands by shop and category fetched successfully!");
    return res.status(statusCodes.OK).send({
      data: brands,
      message: "Brands by shop and category fetched successfully!",
    });
  } catch (error) {
    logger.error(`error in GetBrandsByShopAndCategory:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in getting brands by shop and category",
    });
  }
};

exports.deleteBrands = async (req, res) => {
  try {
    const brand = req.params.id;
    const result = await brandHelper.deleteBrand(brand);
    if (!result) {
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send("Error Deleting Brands");
    }
    logger.info("Brand Deleted Succesfully");
    return res
      .status(statusCodes.OK)
      .json({ data: result, message: "Brand Deleted Succesfully" });
  } catch (error) {
    logger.warn("Error in deleting brand");
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const result = await brandHelper.modifyBrand(req.params.id, req.body.name);
    if (!result) {
      return res.status(statusCodes.NOT_FOUND).send("Error Updating Brands");
    }
    logger.info("Brand Modified Succesfully");
    return res
      .status(statusCodes.OK)
      .json({ data: result, message: "Brand Modified Succesfully" });
  } catch (error) {
    logger.error("Error in Modifing brand");
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const result = await brandHelper.getBrand(req.params.id);
    if (!result) {
      return res.status(statusCodes.NOT_FOUND).send({
        data: [],
        message: "No brands found ",
      });
    }
    logger.info("Brand Fetched Succesfully");
    return res
      .status(statusCodes.OK)
      .send({ data: result, message: "Brand Fetched Succesfully" });
  } catch (error) {
    logger.error(`Error in getting Brand:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: "Error in getting brands",
    });
  }
};

exports.addNewBrand = async (req, res) => {
  try {
    const brand = await brandHelper.addBrand(req.body);
    logger.info("Brand Created Succesfully");
    return res
      .status(statusCodes.OK)
      .json({ data: brand, message: "Brand Created Succesfully" });
  } catch (error) {
    logger.error("Error Creating Brand");
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: message.error });
  }
};
