const router = require('express').Router();
const vendorController = require('../../controllers/vendor/vendor.controller');

//get all vendors
router.get('/', vendorController.GetAllVendors);

//get vendor by id
router.get('/id', vendorController.GetVendorById);

//add vendor
router.post('/', vendorController.AddVendor);

module.exports = router;