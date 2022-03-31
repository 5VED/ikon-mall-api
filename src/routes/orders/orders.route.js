const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orders/orders.controller');

router.post('/', orderController.PlaceOrder);

module.exports = router;