const cartHelper = require('../../helper/cart.helper');
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require('../../../lib/logger');

//add to cart
exports.AddToCart = async (req, res) => {
    try {
        const payload = req.body;
        const result = await cartHelper.addToCart(payload);
        logger.log("info", "Item added to cart successfully");
        return res.status(statusCodes.OK).send({ data: result, message: 'Item added to cart successfully' });
    } catch (error) {
        logger.log("error", `Error in adding item to cart:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message, message: 'Error in adding item to cart' });
    }
}

//remove item from cart
exports.RemoveFromCart = async (req, res) => {
    try {
        const payload = req.body;
        const result = await cartHelper.removeFromCart(payload);
        logger.log("info", "Item removed from cart successfully");
        return res.status(statusCodes.OK).send({ data: result, message: 'Item removed from cart successfully' });
    } catch (error) {
        logger.log("error", `Error in removing item from cart:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message, message: 'Error in removing item from cart'});
    }
}

exports.GetCartItems = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await cartHelper.getCartItems(userId);
        logger.log("info", "Cart items fetched successfully");
        return res.status(statusCodes.OK).send({
            message: 'Cart items fetched successfully',
            data: result,
        })
    } catch (error) {
        logger.log("error", `Error in getting cart items:: ${error.message}`);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            message: 'Error in getting cart items',
            error: error.message
        })
    }
}