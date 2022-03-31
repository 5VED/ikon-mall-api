const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.User = require("./user/user.model");
db.Token = require("./user/tokens.model");
db.role = require("./role.model");
db.otp =require("./otp.model");
db.Address = require("./user/address.model");
//shop
db.Shop = require("./shop/shop.model");
db.Category = require("./category.model");
db.ShopRating = require("../models/shop/rating.model");

//product
db.brand = require("./product/brand.model");
db.product = require("./product/product.model");
db.productItem = require("./product/productItem.model");
db.ProductRating = require("../models/product/rating.model");

//vendor
db.Vendor = require("./vendor.model");

db.ROLES = ["ADMIN", "VENDER", "CUSTOMER"];

db.Cart = require("./cart.model");
db.Wishlist = require("./user/wishlist.model");
db.Order = require("./order/order.model");
db.OrderItem = require("./order/orderItem.model");

module.exports = db;