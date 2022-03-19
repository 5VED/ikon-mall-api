const fs = require("fs");
const csv = require("fast-csv");
const productHelper = require("../../helper/product.helper");
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require("../../../lib/logger");

exports.addProductItemAndProduct = async (req, res) => {
  try {
    if (req.file == undefined) {
      logger.warn("Please upload a CSV file!");
      return res.status(statusCodes.BAD_REQUEST).send({
        message: "Please upload a CSV file!",
      });
    }
    let csvData = [];
    let filePath = __basedir + "/uploads/" + req.file.filename;
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", async () => {
        const data = await productHelper.processDataForUpload(csvData);
        if (data) {
          logger.info("Data inserted successfully");
          return res.status(statusCodes.OK).send({ data: data, message: 'Data inserted successfully' });
        }
      });
  } catch (error) {
    logger.error(`Could not upload the file:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Could not upload the file: " + req.file.originalname,
      error: error.message
    });
  }
};

exports.getProductItemAndProduct = async (req, res) => {
  const data = await productHelper.getProductItemAndProduct();
  res.status(statusCodes.OK).send({
    message: "Product Item fetched successfully!",
    data: data,
  });
};

exports.getProductItemWithFilter = async (req, res) => {
  try {
    const result = await productHelper.getProductItemsWithFilters(req.query);
    logger.info("Product items with filters fetched successfully!");
    return res.status(statusCodes.OK).send({data: result, message: 'Product items with filters fetched successfully!'});
  } catch (error) {
    logger.error(`Error in getting Product items with filters:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({error: error.message, message: 'Error in getting Product items with filters.'});
  }
}

exports.getProductItemsByShopAndCategory = async (req, res) => {
  try {
    const params = req.query;
    const result = await productHelper.getProductItemsByShopAndCategory(params);
    logger.info("Product Items by Shop and Category fetched successfully!");
    return res.status(statusCodes.OK).send({
      data: result,
      message: 'Product Items by Shop and Category fetched successfully!'
    });
  } catch (error) {
    logger.error(`Error in getting Product Items by Shop and Category:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in getting Product Items by Shop and Category'
    });
  }
}

exports.RateProduct = async (req, res) => {
  try {
    const payload = req.body;
    const result = await productHelper.rateProduct(payload);
    logger.info("Product item rated successfully");
    return res.status(statusCodes.OK).send({
      data: result,
      message: 'Product item rated successfully'
    })
  } catch (error) {
    logger.error(`Error in rating product item:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in rating product item'
    })
  }
}

exports.GetProductItemRatingsByProductItemId = async (req, res) => {
  try {
    const productItemId = req.query.productItemId;
    const result = await productHelper.getProductItemRatingsByProductItemId(productItemId);
    logger.info("Product item ratings fetched successfully");
    return res.status(statusCodes.OK).send({
      data: result,
      message: 'Product item ratings fetched successfully'
    })
  } catch (error) {
    logger.error(`Error in getting product item ratings:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in getting product item ratings'
    })
  }
}

exports.GetProductItemsByShop = async (req, res) => {
  try {
    const params = req.query;
    const result = await productHelper.getProductItemsByShop(params);
    logger.info("Product items by shop fetched successfully");
    return res.status(statusCodes.OK).send({
      data: result,
      message: 'Product items by shop fetched successfully'
    })
  } catch (error) {
    logger.error(`Error in getting product items by shop:: ${error.message}`);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in getting product items by shop'
    })
  }
}