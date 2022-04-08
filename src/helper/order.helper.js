const { Order, OrderItem, Shop } = require("../models/index");
const { ObjectId } = require("mongoose").Types;
const common = require("../../lib/common");

exports.placeOrder = async (payload) => {
  let order = new Order({
    paymentMode: payload.paymentMode,
    shippingAddress: payload.shippingAddress,
    userId: payload.userId,
    shopId: payload.shopId,
    orderStatus: "pending",
    transactionId: payload.shopId,
    deliveryStatus: "confirm"
  });
  order = await order.save();
  if (order._id) {
    await payload.productItems.forEach(async (element) => {
      const productItems = new OrderItem({
        productItemId: element.productItemId,
        quantity: element.quantity,
        orderId: order._id,
        price:element.price
      });
      await productItems.save();
    });
  }
  return order;
};

// exports.getUserOrders = async (payload) => {
//   const userOrders = new OrderItem({
//     productItemId: payload.productItemId,
//     orderId: payload.orderId,
//     quantity: payload.quantity,
//     price: payload.price,
//     deliveryStatus: "shipped",
//     updatedAt: payload.updatedAt,
//     deletedAt: payload.deletedAt,
//   });
//   console.log(userOrders);
//   return userOrders.save();
// };

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
        from: 'orderitems',
        let: { 'order_id': '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$orderId', '$$order_id'] } }
          },
          {
            $lookup: {
              from: 'productitems',
              localField: 'productItemId',
              foreignField: '_id',
              as: 'productItem'
            }
          },
          {
            $unwind: {
              path: '$productItem'
            }
          }
        ],
        as: 'ordersitems'
      }
    },
    { $sort: { orderedAt: -1 } },
    {
      $skip: parseInt(skip),
    },
    {
      $limit: parseInt(limit),
    },
  ];
  return Order.aggregate(query).exec();
};
