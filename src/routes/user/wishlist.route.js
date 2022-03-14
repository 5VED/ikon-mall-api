const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/user/wishlist.controller');
const wishlistValidators = require('../../validator/wishlist.validator');

router.post('/', wishlistController.addToWishlist);

router.put('/remove-item', wishlistController.RemoveFromWishlist);
router.get('/', wishlistController.GetWishlist);

module.exports = router;