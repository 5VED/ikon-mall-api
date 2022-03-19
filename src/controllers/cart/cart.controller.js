const cartHelper = require('../../helper/cart.helper');
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require('../../../lib/logger');

//add to cart
exports.AddToCart = async (req, res) => {
    try {
        const payload = req.body;
        const result = await cartHelper.addToCart(payload);
        logger.info('Item added/updated to cart successfully');
        return res.status(statusCodes.OK).send({ data: result, message: 'Item added to cart successfully' });
    } catch (error) {
        logger.error(`Error in AddToCart:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message, message: 'Error in adding item to cart' });
    }
}

//remove item from cart
exports.RemoveFromCart = async (req, res) => {
    try {
        const payload = req.body;
        const result = await cartHelper.removeFromCart(payload);
        if (result.matchedCount === 0) {
            logger.warn('Item not found');
            return res.status(statusCodes.NOT_FOUND).json({ data: result, message: 'Item not found' });
        }
        logger.info('Item removed from cart successfully');
        return res.status(statusCodes.OK).json({ data: result, message: 'Item removed from cart successfully' });
    } catch (error) {
        logger.error(`Error in RemoveFromCart:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message, message: 'Error in removing item from cart'});
    }
}

exports.GetCartItems = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await cartHelper.getCartItems(userId);
        if (result.length === 0) {
            logger.warn('Items not found');
            return res.status(statusCodes.NOT_FOUND).json({
                message: 'Items not found',
                data: [],
            })
        }
        logger.info('Cart items fetched successfully');
        return res.status(statusCodes.OK).json({
            message: 'Cart items fetched successfully',
            data: result,
        })
    } catch (error) {
        logger.error(`Error in GetCartItems:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            message: 'Error in getting cart items',
            error: error.message
        })
    }
}