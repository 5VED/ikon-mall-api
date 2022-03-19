const brandHelper = require('../../helper/brand.helper');
const statusCodes = require('http-status-codes').StatusCodes;
const logger = require('../../../lib/logger');

exports.getAllBrands = async (req, res) => {
    try {
        const result = await brandHelper.getAllBrands(req.query); 
        if (result.length === 0) {
            logger.warn("brands not found");
            return res.status(statusCodes.NOT_FOUND).json({
                data: [],
                message: 'brands not found'
            });
        }
        logger.info("Brands fetched successfully");
        return res.status(statusCodes.OK).json({
            data: result,
            message: 'Brands fetched successfully'
        })
    } catch (error) {
        logger.error(`Error in getAllBrands:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            message: 'Error in getting brands'
        })
    }
}

exports.GetBrandsByShopAndCategory = async (req, res) => {
    try {
        const { shopId, categoryId, skip, limit } = req.query;
        const brands = await brandHelper.getBrandsByShopAndCategory(shopId, categoryId, skip, limit);
        if (brands.length === 0) {
            logger.warn('Brands by shop and category not found!');
            return res.status(statusCodes.NOT_FOUND).send({
                data: [],
                message: 'No brands found by shop and category'
            })    
        }
        logger.info('Brands by shop and category fetched successfully!');
        return res.status(statusCodes.OK).send({
            data: brands,
            message: 'Brands by shop and category fetched successfully!'
        })
    } catch (error) {
        logger.error(`error in GetBrandsByShopAndCategory:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            error: error.message,
            message: 'Error in getting brands by shop and category'
        })
    }
}