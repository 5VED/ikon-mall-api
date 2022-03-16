const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/user/wishlist.controller');
const middleware = require("../../middlewares/verifyToken");

router.get('/', middleware.verifyToken, wishlistController.GetWishlist);
router.post('/', middleware.verifyToken, wishlistController.addToWishlist);
router.delete('/', middleware.verifyToken, wishlistController.RemoveFromWishlist);

module.exports = router;