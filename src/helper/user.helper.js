const { Address, User, Token } = require('../models/index');
const { USER, TOKEN_KEY } = require("../../lib/constant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../../lib/utils");
const { ObjectId } = require('mongoose').Types


exports.saveAddress = async (payload) => {
    const address = new Address({
        addressName: payload.addressName,
        isOther: payload.isOther,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        zipcode: payload.zipcode,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        location: { type: 'Point', coordinates: [payload.longitude, payload.latitude] },
        userId: payload.userId
    });
    const error = await address.validate();
    if (error) {
        throw error;
    } else {
        return address.save();
    }
}

exports.deleteAddress = async (addressId) => {
    return Address.updateOne(
        { _id: ObjectId(addressId.toString()), deleted: false },
        {
            $set: {
                deleted: true,
                deletedAt: Date.now()
            }
        }
    );
}

exports.updateAddress = async (addressId, payload) => {
    payload = { ...payload, updatedAt: Date.now() };
    return Address.findByIdAndUpdate(
        addressId.toString(),
        {
            $set: payload
        }
    );
}

exports.getAllAddress = async (userId, skip, limit) => {
    return Address.find({ deleted: false, userId: userId.toString() }).skip(skip).limit(limit).exec();
}

exports.signup = async (payload) => {
    const { username, email, password } = payload;
    const isUserExists = await User.findOne({ email: email.toString().toLowerCase() });
    if (isUserExists) {
        return { userExists: true };
    }
    const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: password,
        role: USER,
        otp: generateOTP()
    });
    return newUser.save();
}

exports.login = async (payload) => {
    const { email, password } = payload;
    const user = await User.findOne({ email: email.toString().toLowerCase(), deleted: false });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email }, TOKEN_KEY, { expiresIn: "24h" });
        const newToken = new Token({
            user: user._id,
            email: user.email,
            token: token
        });
        await newToken.save();
        return { login: true, token: token, message: 'Login successful' };
    }
    return { login: false, token: null, message: 'Invalid crentials' };
}

exports.changePassword = async (payload) => {
    const { email, oldPassword, newPassword } = payload;
    const user = await User.findOne({ email: email.toString().toLowerCase() }).lean();
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
        return User.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: bcrypt.hashSync(newPassword, 10),
                    updatedAt: Date.now()
                }
            }
        );
    }
    return user;
}

exports.verifyOtp = async (payload) => {
    const { email, otp } = payload;
    const user = await User.updateOne(
        {
            email: email.toString().toLowerCase(),
            otp: otp
        },
        {
            $set: {
                otp: null,
                verified: true,
                updatedAt: Date.now()
            }
        }
    );
    if (user.modifiedCount === 1) {
        return { verified: true, message: 'User verification successful' }
    }
    return { verified: false, message: 'User not verified' };
}