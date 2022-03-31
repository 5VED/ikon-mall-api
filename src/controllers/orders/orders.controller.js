const orderHelper = require("../../helper/order.helper");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");
const Order = require("../../models/order/order.model");
const { User } = require("../../models");
const OrderHelper = require("../../helper/order.helper");
const { ObjectId } = require("mongoose").Types;

exports.PlaceOrder = async (req, res) => {
  try {
    const result = await orderHelper.placeOrder(req.body);
    return res.status(StatusCodes.OK).json({
      message: "Order place successfully",
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
    const shopId = req.query.shopId;
    const order = await orderHelper.getOrdersByShopId(shopId);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Orders fetched Succesfullt", orders: order });
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
    const userId = req.query.userId;
    const order = await orderHelper.getOrdersByUserId(userId);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Orders fetched Succesfullt", orders: order });
  } catch (error) {
    logger.error(`Error in fetching orders:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in fetching orders",
    });
  }
};
