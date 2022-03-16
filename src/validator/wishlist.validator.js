const joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const requiredValidator = (req, res, next) => {
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

module.exports = { requiredValidator }