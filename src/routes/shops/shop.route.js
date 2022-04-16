const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shops/shop.controller');
const imageMiddleware = require('../../middlewares/attachment-middleware');
const multer = require('multer');
const upload = multer({storage: imageMiddleware.image.storage, limits: { fileSize: 8000000 }, allowedImage: imageMiddleware.image.allowedImage});
const shopValidator = require('../../validator/shop.validator');
const middleware = require("../../middlewares/verifyToken");


router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get('/', shopController.getShops);
router.post('/', upload.fields([{ name: 'shopImage', maxCount: 1 }, { name: 'shopLogo', maxCount: 1 }]), shopController.AddShop)
router.post('/rating', middleware.verifyToken, shopValidator.RateShopValidator, shopController.RateShop);
router.get('/rating', shopController.GetShopRatingsByShopId);
router.put('/:shopId', shopController.EditShop);
router.delete('/:shopId', shopController.DeleteShop);
 router.get('/:shopId', shopController.getShop);
router.get('/brand/:shopId', shopController.getShopBrands);

module.exports = router;