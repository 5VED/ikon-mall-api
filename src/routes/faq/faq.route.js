const express = require("express");
const router = express.Router();
const faqController = require("../../controllers/faq/faq.controller");

router.post("/", faqController.newFaq);
router.get("/", faqController.getFaqs);

module.exports = router;
