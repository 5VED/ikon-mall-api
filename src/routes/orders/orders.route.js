const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/orders/orders.controller");

router.post("/", orderController.PlaceOrder);
 router.get("/:userId", orderController.getUserOrders);
router.get("/shop/:shopId", orderController.getShopOrders);

module.exports = router;
