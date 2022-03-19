const categoryHelper = require('../../helper/category.helper');
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require("../../../lib/logger");

exports.getAllCategory = async (req, res) => {
    try {
        const result = await categoryHelper.getAllCategory(req.query);
        if (result.length === 0) {
            logger.warn('No data found');
            return res.status(statusCodes.NOT_FOUND).send({ data: [], message: 'No data found'});    
        }
        logger.info("Categories fetched successfully!");
        return res.status(statusCodes.OK).send({ data: result, message: 'Categories fetched successfully!'});
    } catch (error) {
        logger.error(`Error in getting categories:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message, message: 'Error in getting categories'});
    }
}

exports.GetProductItemsByCategory = async (req, res) => {
    try {
        const { shopId, skip, limit, sortBy } = req.query;
        const productItems = await categoryHelper.getProductItemsbyCategory(shopId, sortBy, skip, limit);
        if (result.length === 0) {
            logger.warn('No data found');
            return res.status(statusCodes.NOT_FOUND).send({ data: [], message: 'No data found'});    
        }
        logger.info("Product items by category fetched successfully!");
        return res.status(statusCodes.OK).send({ data: productItems, message: 'Product items by category fetched successfully!' });
    } catch (error) {
        logger.error(`Error in getting Product Items by category:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message, message: 'Error in getting Product Items by category'});
    }
}

exports.GetBrandsByCategory = async (req, res) => {
    try {
        const shopId = req.query.shopId;
        const result = await categoryHelper.getBrandsByCategory(shopId);
        if (result.length === 0) {
            logger.warn('No data found');
            return res.status(statusCodes.NOT_FOUND).send({ data: [], message: 'No data found'});    
        }
        logger.info("Brands group by category fetched successfully");
        return res.status(statusCodes.OK).json({
            data: result,
            message:  'Brands group by category fetched successfully'
        })
    } catch (error) {
        logger.error(`Error in getting brands group by category:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            error: error.message,
            message: 'Error in getting brands group by category'
        })
    }
}

exports.AddCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const result = await categoryHelper.addCategory(categoryName);
        logger.info("Category Added successfully");
        return res.status(statusCodes.OK).json({
            data: result,
            message: 'Category Added successfully'
        });
    } catch (error) {
        logger.error(`Error in adding category:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            message: 'Error in adding category'
        });
    }
}