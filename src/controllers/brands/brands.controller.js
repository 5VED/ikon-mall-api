const brandHelper = require('../../helper/brand.helper');
const statusCodes = require('http-status-codes').StatusCodes;
const logger = require('../../../lib/logger');

exports.getAllBrands = async (req, res) => {
    try {
        const result = await brandHelper.getAllBrands(req.query);
        logger.log("info","brands fetched successfully");
        return res.status(statusCodes.OK).send({
            data: result,
            message: 'brands fetched successfully'
        })
    } catch (error) {
        logger.log("error",`error in getting brands:: ${error.message}`)
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            error: error,
            message: 'error in getting brands'
        })
    }
}

exports.GetBrandsByShopAndCategory = async (req, res) => {
    try {
        const { shopId, categoryId, skip, limit } = req.query;
        const brands = await brandHelper.getBrandsByShopAndCategory(shopId, categoryId, skip, limit);
        logger.log("info", 'Brands by shop and category fetched successfully!');
        return res.status(statusCodes.OK).send({
            data: brands,
            message: 'Brands by shop and category fetched successfully!'
        })
    } catch (error) {
        logger.log("error",`error in getting brands by shop and category:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            error: error.message,
            message: 'Error in getting brands by shop and category'
        })
    }
}