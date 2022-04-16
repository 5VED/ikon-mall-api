const faqHelper = require("../../helper/faq.helper");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");
const { query } = require("../../../lib/logger");

exports.newFaq = async (req, res) => {
  try {
    const result = await faqHelper.createFaq(req.body);
    logger.info("Faq added Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Faq added Succesfully" });
  } catch (error) {
    logger.error("Error occured while adding Question");
    res
      .statu(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, message: "Error in adding Question" });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const result = await faqHelper.getFaqHelper(req.query);
    if (result.length === 0) {
      logger.warn();
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ data: [], message: "No FAQ Exist" });
    }
    logger.info("Faq fetched Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "FAQ's Fetched Succesfully" });
  } catch (error) {
    logger.error("Error occured while getting FAQ's");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, message: "Error in Fetching FAQ's" });
  }
};
