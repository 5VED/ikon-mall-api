const joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const AddToCartValidator = async (req, res, next) => {
    const expected = new joi.object({
        userId: joi.string().required(),
        productItemId: joi.string().required(),
        add: joi.boolean().required()
    });

    const actual = {
        userId: req.body.userId,
        productItemId: req.body.productItemId,
        add: req.body.add
    }

    const { error } = expected.validate(actual);
    if(error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message.toString() });
    }
    next();
}

const RemoveFromCartValidator = (req, res, next) => {
    const expected = new joi.object({
        userId: joi.string().required(),
        productItemId: joi.string().required()
    });

    const actual = {
        userId: req.body.userId,
        productItemId: req.body.productItemId
    }

    const { error } = expected.validate(actual);

    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message.toString() });
    }

    next();
}

const GetCartItemValidator = (req, res, next) => {
    const expected = new joi.object({
        userId: joi.string().required(),
    });
    const actual = {
        userId: req.query.userId
    }
    const { error } = expected.validate(actual);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
    next();
}

module.exports = { AddToCartValidator, RemoveFromCartValidator, GetCartItemValidator }