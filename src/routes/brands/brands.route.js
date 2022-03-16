const router = require('express').Router();
const brandController = require('../../controllers/brands/brands.controller');

router.get('/', brandController.getAllBrands);
router.get('/categoryshop', brandController.GetBrandsByShopAndCategory);

module.exports = router;