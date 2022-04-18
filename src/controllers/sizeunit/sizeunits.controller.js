const { StatusCodes } = require("http-status-codes");
const logger = require("../../../lib/logger");
const sizeUnitHelper = require("../../helper/sizeunit.helper");

//add size unit
exports.newSizeUnit = async (req, res) => {
  try {
    const result = await sizeUnitHelper.createSizeUnit(req.body);
    if (!result) {
      logger.error("Error in creating size unit");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: [], essage: "Error in creating size unit" });
    }
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
exports.deleteSizeUnit = async (req, res) => {
  try {
    const unitId = req.params.id;
    const result = await sizeUnitHelper.deleteUnit(unitId);
    console.log(result);
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).send("Size Unit Not Found");
    }
    logger.info("Size Unit Removed Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Removed Succesfully" });
  } catch (error) {
    logger.warn("Error in deleting Size Unit");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

//update size unit
exports.updateSizeUnit = async (req, res) => {
  try {
    const result = await sizeUnitHelper.modifySizeUnit(
      req.params.id,
      req.body.unit
    );

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).send("Error Updating Size Unit");
    }
    logger.info("Size Unit Modified Succesfully");
    return res
      .status(StatusCodes.OK)
      .json({ data: result, message: "Size Unit Modified Succesfully" });
  } catch (error) {
    logger.error("Error in Modifing Size Unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//get size unit
exports.getAllSizeUnitById = async (req, res) => {
  try {
    const result = await sizeUnitHelper.getSizeUnit(req.params.id);
    console.log(result);
    logger.info("Size Unit fetched successfully!");
    return res.status(StatusCodes.OK).send({
      message: "Size Unit successfully!",
      data: result,
    });
  } catch (error) {
    logger.error(`Error in fetch Size Unit:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Error in fetch Size Unit",
      error: error.message,
    });
  }
};

exports.getAllSizeUnit = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const result = await sizeUnitHelper.getAllUnits(skip, limit);
    logger.info("Size Units fetched successfully!");
    return res.status(StatusCodes.OK).send({
      message: "Size Units fetched successfully!",
      data: result,
    });
  } catch (error) {
    logger.error("Error in fetching size unit");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
