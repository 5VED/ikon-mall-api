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
  order.save(function (err, response) {
    if (err) {
    } else {
      payload.productItems.forEach((element) => {
        const order = new OrderItem({
          productItemId: element.productItemId,
          quantity: element.quantity,
          deliveryStatus: element.deliveryStatus,
          orderId: response._id,
        });
        order.save();
      });
      return response;
    }
  });
};

exports.getUserOrders = async (payload) => {
  const userOrders = new OrderItem({
    productItemId: payload.productItemId,
    orderId: payload.orderId,
    quantity: payload.quantity,
    price: payload.price,
    deliveryStatus: "shipped",
    updatedAt: payload.updatedAt,
    deletedAt: payload.deletedAt,
  });
  console.log(userOrders);
  return userOrders.save();
};

//Returns the order from the same shop
exports.getOrdersByShopId = async (shopId, skip, limit) => {
  const query = [
    {
      $match: { shopId: ObjectId(shopId) },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "ORDEREDITEMS",
      },
    },
    {
      $skip: parseInt(skip),
    },
    {
      $limit: parseInt(limit),
    },
  ];
  return Order.aggregate(query).exec();
};

//Returns the order from the same user
exports.getOrdersByUserId = async (userId, skip, limit) => {
  const query = [
    {
      $match: { userId: ObjectId(userId) },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "ORDEREDITEMS",
      },
    },
    {
      $skip: parseInt(skip),
    },
    {
      $limit: parseInt(limit),
    },
  ];
  return Order.aggregate(query).exec();
};
