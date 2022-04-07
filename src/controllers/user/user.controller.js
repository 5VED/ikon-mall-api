'use strict';
const { StatusCodes } = require('http-status-codes');
const userHelper = require('../../helper/user.helper');
const logger = require("../../../lib/logger");

exports.AddUserAddress = async (req, res) => {
  try {
    const result = await userHelper.saveAddress(req.body);
    logger.info("Address added successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address added successfully'
    })
  } catch (error) {
    logger.error(`Error in adding address:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in adding address'
    })
  }
}

exports.DeleteAddress = async (req, res) => {
  try {
    const result = await userHelper.deleteAddress(req.params.addressId);
    if (!result.matchedCount) {
      logger.warn('address not found');
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: 'address not found'
      })
    }
    logger.info("Address deleted successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleting address:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in deleting address'
    });
  }
}

exports.UpdateAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const payload = req.body;
    const result = await userHelper.updateAddress(addressId, payload);
    if (!result) {
      logger.warn('address not found');
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: 'address not found'
      })
    }
    logger.info("Address updated successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address updated successfully'
    })
  } catch (error) {
    logger.error(`Error in updating address:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in updating address'
    })
  }
}

exports.GetAllAddress = async (req, res) => {
  try {
    const { userId, skip, limit } = req.query;
    const result = await userHelper.getAllAddress(userId, skip, limit);
    logger.info("Address fetched successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Addresses fetched successfully'
    })
  } catch (error) {
    logger.error(`Error in getting address:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in getting address'
    })
  }
}

exports.Signup = async (req, res) => {
  try {
    const payload = req.body;
    const result = await userHelper.signup(payload);
    if(result['userExists']) {
      logger.warn("Email address already taken");
      return res.status(StatusCodes.CONFLICT).json({
        data: result,
        message: 'Email address already taken'
      })  
    }
    logger.info("Signup successfull");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Signup successfull'
    })
  } catch (error) {
    logger.error(`Error in signing up:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in signing up'
    })
  }
}

exports.Login = async (req, res) => {
  try {
    const payload = req.body;
    const result = await userHelper.login(payload);
    if(result.login) {
      logger.info("Login successful");
      return res.status(StatusCodes.OK).json({
        token: result.token,
        message: result.message
      });
    }
    logger.warn("Invalid credentials");
    return res.status(StatusCodes.UNAUTHORIZED).json({
      token: result.token,
      message: result.message
    });
  } catch (error) {
    logger.error(`Error in login:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in login'
    });
  }
}

exports.ChangePassword = async (req, res) => {
  try {
    const payload = req.body;
    const result = await userHelper.changePassword(payload);
    if (result['matchedCount'] && result['modifiedCount']) {
      logger.info("password changed successfully");
      return res.status(StatusCodes.OK).json({
        data: result,
        message: 'password changed successfully'
      });
    } else if (result) {
      logger.warn("old password is not matched");
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        data: [],
        message: 'old password is not matched'
      });
    } else {
      logger.warn("user not found")
      return res.status(StatusCodes.NOT_FOUND).json({
        data: [],
        message: 'user not found'
      })
    }
  } catch (error) {
    logger.error(`Error in changing password:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in changing password"
    });
  }
}

exports.VerifyOtp = async (req, res) => {
  try {
    const payload = req.body;
    const result = await userHelper.verifyOtp(payload);
    if (result.verified) {
      logger.info("otp verified");
      return res.status(StatusCodes.OK).json({
        data: result,
        message: result.message
      });
    }
    logger.warn("Invalid otp");
    return res.status(StatusCodes.NOT_FOUND).json({
      data: result,
      message: result.message
    });
  } catch (error) {
    logger.error(`error in verifying OTP:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: "Error in verifying OTP"
    })
  }
}

exports.AddUserCard = async (req, res) => {
  try {
    const result = await userHelper.saveCard(req.body);
    logger.info("card added successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'card added successfully'
    })
  } catch (error) {
    logger.error(`Error in adding card:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in adding card'
    })
  }
}

exports.GetAllCardByUserId = async (req, res) => {
  try {
    const result = await userHelper.getAllCardByUserId(req.params.userId);
    logger.info("cards fetched successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'cards fetched successfully'
    })
  } catch (error) {
    logger.error(`Error in getting cards:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in getting cards'
    })
  }
}