const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shops/shop.controller');
const imageMiddleware = require('../../middlewares/attachment-middleware');
const multer = require('multer');
const upload = multer({storage: imageMiddleware.image.storage(), allowedImage: imageMiddleware.image.allowedImage});
const shopValidator = require('../../validator/shop.validator');


router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get('/', shopController.getShops);

router.post('/', upload.fields([{ name: 'shopImage', maxCount: 1 }, { name: 'shopLogo', maxCount: 1 }]), shopController.AddShop)
router.post('/rate', shopValidator.RateShopValidator, shopController.RateShop);
router.get('/rating', shopController.GetShopRatingsByShopId);
router.put('/', shopController.EditShop);
router.delete('/', shopController.DeleteShop);

module.exports = router;