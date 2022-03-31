const orderHelper = require('../../helper/order.helper');
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");

exports.PlaceOrder = async (req, res) => {
    try {
        const result = await orderHelper.placeOrder(req.body);
        return res.status(StatusCodes.OK).json({
            message: 'Order place successfully',
            data: result
        })
    } catch (error) {
        logger.error(`Error in placing order:: ${error.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            message: 'Error in placing order'
        })
    }
}