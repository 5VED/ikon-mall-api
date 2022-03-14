const router = require('express').Router();
const brandController = require('../../controllers/brands/brands.controller');
const { verifyToken } = require('../../middlewares/verifyToken');

router.get('/', brandController.getAllBrands);

router.get('/categoryshop', brandController.GetBrandsByShopAndCategory);

module.exports = router;