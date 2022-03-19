const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/category.controller');
const categoryValidator = require('../../validator/pagination.validator');

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post('/', categoryController.AddCategory);
router.get('/', categoryValidator.requiredValidator, categoryController.getAllCategory);
router.get('/product-items', categoryController.GetProductItemsByCategory);
router.get('/brand', categoryController.GetBrandsByCategory);

module.exports = router;