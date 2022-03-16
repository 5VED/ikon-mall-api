const express = require('express');
const router = express.Router();
const productItemController = require('../../controllers/product/product-item.controller');
const upload = require('../../middlewares/csv-upload');
const productItemValidator = require('../../validator/product.validator');

router.post('/', upload.single("file"), productItemController.addProductItemAndProduct);
router.get('/', productItemController.getProductItemAndProduct);
router.get('/filters', productItemController.getProductItemWithFilter);
router.get('/categoryshop', productItemController.getProductItemsByShopAndCategory);
router.post('/rating', productItemValidator.RateProductItemValidator, productItemController.RateProduct);
router.get('/rating', productItemController.GetProductItemRatingsByProductItemId);
router.get('/shop', productItemController.GetProductItemsByShop);
module.exports = router;