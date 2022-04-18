const { StatusCodes } = require("http-status-codes");
const logger = require("../../lib/logger");
const { updateOne } = require("../models/sizeunit.model");
const SizeUnit = require("../models/sizeunit.model");

//add size unit
exports.newSizeUnit = async (req, res) => {
  try {
    const result = new SizeUnit({
      unit: req.body.unit,
    });
    if (!result) {
      logger.warn("Error in creating size unit");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: [], essage: "Error in creating size unit" });
    }
    await result.save();
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Created Succesfully" });
  } catch (error) {
    logger.error("Error in creating size unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//delete size unit
exports.deleteUnit = async (req, res) => {
  try {
    const result = await SizeUnit.updateOne(
      { _id: req.params.id },
      {
        $set: { isDeleted: true },
      }
    );
    if (!result) {
      logger.warn("Size unit does not Exist");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: [], essage: "Size unit does not Exist" });
    }
    logger.info("Size Unit Deleted Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Deleted Succesfully" });
  } catch (error) {
    logger.error("Error in deleting size unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//update size unit
exports.updateSizeUnit = async (req, res) => {
  try {
    const result = await SizeUnit.updateOne(
      { _id: req.params.id },
      {
        $set: { unit: req.body.unit },
      }
    );
    if (!result) {
      logger.warn("Size unit does not Exist");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: [], essage: "Size unit does not Exist" });
    }
    logger.info("Size Unit Deleted Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Updated Succesfully" });
  } catch (error) {
    logger.error("Error in deleting size unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//get size unit
exports.getSizeUnit = async (req, res) => {
  try {
    const result = await SizeUnit.findOne({ _id: req.params.id });
    if (!result) {
      logger.warn("Size unit does not Exist");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: [], essage: "Size unit does not Exist" });
    }
    logger.info("Size Unit Fetched Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Fetched Succesfully" });
  } catch (error) {
    logger.error("Error in fetching size unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
