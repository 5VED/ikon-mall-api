const joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const RateProductItemValidator = (req, res, next) => {
    const expected = new joi.object({
        userId: joi.string().required(),
        productItemId: joi.string().required(),
        star: joi.number().min(1).max(5).required()
    });
    const actual = {
        userId: req.body.userId,
        productItemId: req.body.productItemId,
        star: req.body.star
    };
    const { error } = expected.validate(actual);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).send({ error: error.message.toString()});
    }
    next();
}

module.exports = { RateProductItemValidator };