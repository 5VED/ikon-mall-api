const joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const requiredValidator = (req, res, next) => {
    const expected = new joi.object({
        skip: joi.string().required(),
        limit: joi.string().required()
    });
    const result = {
        skip: req.query.skip,
        limit: req.query.limit
    }
    const { error } = expected.validate(result);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: error.message.toString(),
            message: 'Required parameters missing!'
        });
    }
    next();
}

module.exports = { requiredValidator }