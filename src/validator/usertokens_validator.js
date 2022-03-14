const Joi = require('joi');
const { responsevalidation } = require('../../lib/utils');
const httpStatusCode = require('http-status-codes');
const usertokenSchema = async (req, res, next) => {
    // define base schema rules
    const schema = Joi.object({
        Token : Joi.number(),
        UserId : Joi.number().required(),
        ExpiryTime : Joi.date(),
        tokenGeneratedTime : Joi.date(),
    });

    const body = {
        Token : req.body.Token,
        UserId : req.body.UserId,
        ExpiryTime : new Date(),
        tokenGeneratedTime : req.headers.tokenGeneratedTime,
    };


    // validate request body against schema
    const { error, value } = schema.validate(body);
    console.log(error, value);
    if (error) {
        // on fail return comma separated errors
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        //console.log(error.details.map(x => x.message).join(', ').replace(/"/g, ''))
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(responsevalidation(httpStatusCode.INTERNAL_SERVER_ERROR, error.details.map(x => x.message).join(', ').replace(/"/g, ''), true))
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

module.exports = { usertokenSchema }
