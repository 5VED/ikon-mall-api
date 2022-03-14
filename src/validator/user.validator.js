const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const SignUpValidator = (req, res, next) => {
    const expected = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const actual = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    const { error } = expected.validate(actual);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
    next();
}

const LoginValidator = (req, res, next) => {
    const expected = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const actual = {
        email: req.body.email,
        password: req.body.password
    };
    const { error } = expected.validate(actual);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
    next();
}

module.exports = { SignUpValidator, LoginValidator }
