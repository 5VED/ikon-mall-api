const route = {};
route.productItem = require("./product-item/product-item.route");
route.shop = require("./shops/shop.route");
route.vendor = require("./vendor/vendor.route");
route.category = require("./category/category.route");
route.cart = require("./cart/cart.route");
route.brand = require("./brands/brands.route");
route.wishlist = require("./user/wishlist.route");
route.user = require("./user/user.route");
route.order = require("./orders/orders.route");

module.exports = route;