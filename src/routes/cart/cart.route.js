const router = require('express').Router();
const cartController = require('../../controllers/cart/cart.controller');
const cartValidators = require('../../validator/cart.validator');
const middleware = require("../../middlewares/verifyToken");

// add to cart
router.post('/', middleware.verifyToken, cartValidators.AddToCartValidator, cartController.AddToCart);
// remove item from cart 
router.delete('/', middleware.verifyToken, cartValidators.RemoveFromCartValidator, cartController.RemoveFromCart);
// get cart items
router.get('/', middleware.verifyToken, cartValidators.GetCartItemValidator, cartController.GetCartItems);
module.exports = router;