const express = require("express");
const router = express.Router();
const sizeUnit = require('../controllers/sizeunit/sizeunits.controller');

router.post("/", sizeUnit.newSizeUnit);
router.delete("/:id", sizeUnit.deleteSizeUnit);
router.get("/:id", sizeUnit.getAllSizeUnitById);
router.put("/:id", sizeUnit.updateSizeUnit);
router.get("/", sizeUnit.getAllSizeUnit);

module.exports = router;
