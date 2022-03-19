const router = require('express').Router();
const brandController = require('../../controllers/brands/brands.controller');
const brandValidator = require('../../validator/pagination.validator');

router.get('/', brandValidator.requiredValidator, brandController.getAllBrands);
router.get('/categoryshop', brandValidator.requiredValidator, brandController.GetBrandsByShopAndCategory);

module.exports = router;