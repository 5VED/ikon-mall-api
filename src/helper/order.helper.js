const { Order, OrderItem, Shop } = require("../models/index");
const { ObjectId } = require("mongoose").Types;

exports.placeOrder = async (payload) => {
  const order = new Order({
    orderTotal: payload.orderTotal,
    paymentMethod: payload.paymentMethod,
    shippingAddress: payload.address,
    userId: payload.userId,
    shopId: payload.shopId,
    orderStatus: "pending",
  });
  return order.save();
};

//Returns the order from the same shop
exports.getOrdersByShopId = async (shopId) => {
  const query = [
    {
      $match: { shopId: ObjectId(shopId) },
    },
  ];
  return Order.aggregate(query).exec();
};

//Returns the order from the same user
exports.getOrdersByUserId = async (userId) => {
  const query = [
    {
      $match: { userId: ObjectId(userId) },
    }
    // {
    //   $filter: {
    //     input: ["pending", "in progress", "completed", "canceled", "rejected"],
    //     as: "status",
    //     cond: {
    //       $and: [
    //         { $gte: ["$$num", NumberLong("-9223372036854775807")] },
    //         { $lte: ["$$num", NumberLong("9223372036854775807")] },
    //       ],
    //     },
    //   },
    // },
  ];
  return Order.aggregate(query).exec();
};
