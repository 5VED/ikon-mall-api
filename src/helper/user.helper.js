const { Address, User, Token } = require('../models/index');
const { USER, TOKEN_KEY } = require("../../lib/constant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
        location: { type: 'Point', coordinates: [payload.lng, payload.lat]},
        userId: payload.userId
    });
    const error = await address.validate();
    if (error) {
        throw error;
    } else {
        const doc = await address.save();
        return doc;
    }
}

exports.deleteAddress = async (addressId) => {
    try {
        const result = await Address.findByIdAndUpdate(
            addressId,
            {
                $set: {
                    deleted: true,
                    deletedAt: Date.now()
                }
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

exports.updateAddress = async  (addressId, payload) => {
    try {
        payload = {...payload, updatedAt: Date.now()};
        const result = await  Address.findByIdAndUpdate(
            addressId,
            {
                $set: payload
            }
        )
        return result
    } catch (error) {
        throw error;
    }
}

exports.getAllAddress = async (userId, skip, limit) => {
    try {
        const addresses = await Address.find({ deleted: false, userId: userId}).skip(skip).limit(limit).exec();
        return addresses;
    } catch (error) {
        throw error;
    }
}

exports.signup = async (payload) => {
    try {
        const { username, email, password } = payload;
        const isUserExists = await User.findOne({email: email});
        if (isUserExists) {
            return { userExists: true };
        }
        const newUser = new User({
            username: username,
            email: email.toLowerCase(),
            password: password,
            role: USER
        });
        const user = await newUser.save();
        return user;
    } catch (error) {
        throw error;
    }
}

exports.login = async (payload) => {
    try {
        const { email, password } = payload;
        const user = await User.findOne({ email: email});
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ email: user.email}, TOKEN_KEY, { expiresIn: "24h" });
            const newToken = new Token({
                user: user._id,
                email: user.email,
                token: token
            });
            await newToken.save();
            return { login: true, token: token, message: 'Login successful'};
        }
        return { login: false, token: null, message: 'Invalid crentials'};
    } catch (error) {
        throw error;
    }
}