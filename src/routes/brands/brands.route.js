const router = require('express').Router();
const brandController = require('../../controllers/brands/brands.controller');
const brandValidator = require('../../validator/pagination.validator');


router.get('/categoryshop', brandValidator.requiredValidator, brandController.GetBrandsByShopAndCategory);
router.get('/', brandValidator.requiredValidator, brandController.getAllBrands);
router.post('/',brandController.addNewBrand)
router.delete('/:id', brandController.deleteBrands);
router.get('/:id', brandController.getBrandById);
router.put('/:id', brandController.updateBrand);

module.exports = router;