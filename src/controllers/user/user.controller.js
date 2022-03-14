'use strict';
const userModel = require("../../models/user/user.model");
const otpModel = require("../../models/otp.model")
const roleModel = require("../../models/role.model")
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { secret } = require("../../../config/db.config");
const { generateOTP, fast2sms } = require("../../../lib/utils");
const { user } = require("../../models");
const { StatusCodes } = require('http-status-codes');
const userHelper = require('../../helper/user.helper');
const logger = require("../../../lib/logger");

exports.addNewUser = (req, res) => {
  const user = new userModel({
    role_id: req.body.role_id,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    isActive: true,
    isDeleted: false,
    createdBy: req.body.createdBy,
    createdDate: new Date(),
    modifyBy: req.body.modifyBy,
    modifyDate: new Date(),
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.status(200).send({ message: "User was registered successfully!" })
    }
  });
};

exports.getAllUsers = async (request, response) => {
  const users = await userModel.find({});
  try {
    response.status(200).send(users);
  } catch (error) {
    response.status(500).send(error);
  }
}

exports.auth = async (req, res) => {
  // const users = await userModel.find({email: req.body.email});
  userModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    var token = jwt.sign({ id: user.id }, secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user._id,
      email: user.email,
      roles: user.role_id,
      accessToken: token
    });

  });
}
exports.signupWithPhoneOtp = async (req, res) => {
  let role = await roleModel.findOne({name:"user"})
  try {
    let phoneNumber = req.body.phoneNumber
    const phoneExist = await userModel.findOne({ phoneNumber: phoneNumber });

    if (phoneExist) {
      return res.status(500).send({ message: 'phone number already exits' });
    }

    let createUser = new userModel({
      phoneNumber: req.body.phoneNumber,
      role_id:role._id
    })

    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        phoneno: user.phoneNumber,
      },
    });

    const otp = generateOTP(6);
    console.log('create otp---', phoneNumber);

    await otpModel.create({
      otp: otp,
      phone: user.phoneNumber
    })
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

exports.loginWithPhoneOtp = async (req, res) => {
  try {
    const user = await userModel.findOne({ phoneNumber: req.body.phoneNumber });

    if (!user) {
      return res.status(500).send({ message: 'user not found' });
    }

    res.status(201).json({
      type: "success",
      message: "OTP sended to your registered phone number",
      data: {
        phone: user.phoneNumber,
      },
    });

    const otp = generateOTP(6);
    await otpModel.updateOne({ phone: req.body.phoneNumber }, { otp: otp })
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { otp, phone } = req.body;
    const userOtp = await otpModel.findOne({ phone: phone });
    if (!userOtp) {
      return res.status(500).send({ message: 'user not found' });
    }
    if (userOtp.otp !== otp) {
      return res.status(400).send({ message: 'Invalid otp' });
    }
    await userModel.updateOne({ phoneNumber: phone }, { isVerified: true })

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        phone: phone,
      },
    });
  } catch (error) {
    return res.status(500).send(error);
  }

};
exports.updateUser = async (req, res) => {
  try {
    let phone = req.body.phone
    let updateUser = await userModel.updateOne({ phoneNumber: phone }, req.body)
    if (updateUser) {
      return res.status(201).json({
        type: "success",
        message: "Data Updated successfully",
        data: updateUser
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
}

exports.AddUserAddress = async (req, res) => {
  try {
    const result = await userHelper.saveAddress(req.body);
    logger.log("info", "Address added successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address added successfully'
    })
  } catch (error) {
    logger.log("error", `Error in adding address:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in adding address'
    })
  }
}

exports.DeleteAddress = async (req, res) => {
  try {
    const result = await userHelper.deleteAddress(req.params.addressId);
    logger.log("info", "Address deleted successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    logger.log("error", `Error in deleting address:: ${error.message}`);
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
    logger.log("info", "Address updated successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Address updated successfully'
    })
  } catch (error) {
    logger.log("error", `Error in updating address:: ${error.message}`);
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
    logger.log("info", "Address fetched successfully");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Addresses fetched successfully'
    })
  } catch (error) {
    logger.log("error", `Error in getting address:: ${error.message}`);
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
    if(result?.userExists) {
      logger.log("warn", "Email address already taken");
      return res.status(StatusCodes.CONFLICT).json({
        data: result,
        message: 'Email address already taken'
      })  
    }
    logger.log("info", "Signup successfull");
    return res.status(StatusCodes.OK).json({
      data: result,
      message: 'Signup successfull'
    })
  } catch (error) {
    logger.log("error", `Error in signing up:: ${error.message}`);
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
      logger.log("info", "Login successful");
      return res.status(StatusCodes.OK).json({
        token: result.token,
        message: result.message
      });
    }
    logger.log("warn", "Invalid credentials");
    return res.status(StatusCodes.BAD_REQUEST).json({
      token: result.token,
      message: result.message
    });
  } catch (error) {
    logger.log("error", `Error in login:: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      message: 'Error in login'
    });
  }
}