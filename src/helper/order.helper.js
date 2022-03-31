const { Order, OrderItem } = require("../models/index");

exports.placeOrder = async (payload) => {
    const order = new Order({
        orderTotal: payload.orderTotal,
        paymentMethod: payload.paymentMethod,
        shippingAddress: payload.address,
        userId: payload.userId,
        orderStatus: 'pending'
    });
    return order.save();
}