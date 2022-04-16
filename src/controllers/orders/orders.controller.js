const orderHelper = require("../../helper/order.helper");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");

exports.PlaceOrder = async (req, res) => {
  try {
    const result = await orderHelper.placeOrder(req.body);
    return res.status(StatusCodes.OK).json({
      message: "Order placed successfully",
      data: result,
    });
  } catch (error) {
    logger.error(`Error in placing order:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in placing order",
    });
  }
};

exports.getShopOrders = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const skip = req.query.skip;
    const limit = req.query.limit;

    const order = await orderHelper.getOrdersByShopId(shopId, skip, limit);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Orders fetched Succesfully", orders: order });
  } catch (error) {
    logger.error(`Error in fetching orders:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in fetching orders",
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const skip = req.query.skip;
    const limit = req.query.limit;

    const order = await orderHelper.getOrdersByUserId(userId, skip, limit);

    // console.log(order[0].orderStatus);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Orders fetched Succesfully", orders: order });
  } catch (error) {
    logger.error(`Error in fetching orders:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in fetching orders",
    });
  }
};
