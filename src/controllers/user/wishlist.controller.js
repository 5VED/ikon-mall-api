const { StatusCodes } = require('http-status-codes');
const wishlistHelper = require('../../helper/wishlist.helper');
const logger = require("../../../lib/logger");

exports.addToWishlist = async (req, res) => {
  try {
    const payload = req.body;
    const result = await wishlistHelper.addToWishlist(payload);
    logger.info("Item added to wishlist");
    return res.status(StatusCodes.OK).send({
      data: result,
      message: 'Item added to wishlist'
    });
  } catch (error) {
    logger.error("Error in adding item to wishlist");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in adding item to wishlist'
    })
  }
}

exports.RemoveFromWishlist = async (req, res) => {
  try {
    const payload = req.body;
    const result = await wishlistHelper.removeFromWishlist(payload);
    logger.info("Item removed from wishlist successfully");
    return res.status(StatusCodes.OK).send({
      data: result,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    logger.error(`Error in removing item from wishlist:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in removing item from wishlist'
    })
  }
}

exports.GetWishlist = async (req, res) => {
  try {
    const result = await wishlistHelper.getWishlist(req.query.userId);
    if (result.length === 0) {
      logger.warn("No data found");
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: 'No data found for wishlist'
      })
    }
    logger.info("Wishlist fetched successfully");
    return res.status(StatusCodes.OK).send({
      data: result,
      message: 'Wishlist fetched successfully'
    })
  } catch (error) {
    logger.error(`Error in getting wishlist:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: 'Error in getting wishlist'
    })
  }
}