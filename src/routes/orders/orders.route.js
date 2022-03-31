const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orders/orders.controller');

router.post('/', orderController.PlaceOrder);
router.get('/orders/shops',orderController.getShopOrders)
router.get('/orders/users',orderController.getUserOrders)
module.exports = router;