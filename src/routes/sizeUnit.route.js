const express = require("express");
const router = express.Router();
const sizeUnit = require("../controllers/sizeunits");

router.post("/", sizeUnit.newSizeUnit);
router.delete("/:id", sizeUnit.deleteUnit);
router.get("/:id", sizeUnit.getSizeUnit);
 router.put("/:id", sizeUnit.updateSizeUnit);
// router.get("/", sizeUnit.newSizeUnit);

module.exports = router;
