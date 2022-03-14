const router = require('express').Router();
const cartController = require('../../controllers/cart/cart.controller');
const cartValidators = require('../../validator/cart.validator');

// add to cart
router.post('/', cartValidators.AddToCartValidator, cartController.AddToCart);
// remove item from cart 
router.put('/remove', cartValidators.RemoveFromCartValidator, cartController.RemoveFromCart);
// get cart items
router.get('/', cartValidators.GetCartItemValidator, cartController.GetCartItems);
module.exports = router;