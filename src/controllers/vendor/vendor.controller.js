const vendorHelper = require('../../helper/vendor.helper');
const statusCodes = require('http-status-codes').StatusCodes;
const logger = require("../../../lib/logger");

exports.AddVendor = async (req, res) => {
    try {
        const result = await vendorHelper.addVendor(req.body);
        logger.info("Vendor added successfully!");
        return res.status(statusCodes.OK).send({data: result, message: 'Vendor added successfully!'});
    } catch (error) {
        logger.error(`Error in adding vendor:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            error: error.message,
            message: 'Error in adding vendor'
        });
    }
}

exports.GetAllVendors = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const result = await vendorHelper.getAllVendors(skip, limit);
        logger.info("Vendors fetched successfully!");
        return res.status(statusCodes.OK).send({
            message: 'Vendors fetched successfully!',
            data: result
        });
    } catch (error) {
        logger.error(`Error in fetching vendors:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            message: 'Error in fetching vendors',
            error: error.message
        });
    }
}

exports.GetVendorById = async (req, res) => {
    try {
        const result = await vendorHelper.getVendorById(req.query.vendorId);
        logger.info("Vendor fetched successfully!");
        return res.status(statusCodes.OK).send({
            message: 'Vendor fetched successfully!',
            data: result
        });
    } catch (error) {
        logger.error(`Error in fetch vendor:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            message: 'Error in fetch vendor',
            error: error.message
        });
    }
}