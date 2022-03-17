const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require("../../lib/constant");
const { StatusCodes } = require('http-status-codes')
const logger = require('../../lib/logger')

const verifyToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "token required",
                message: "A token is required for authentication"
            });
        }
        jwt.verify(token, TOKEN_KEY, function(error) {
            if (error) {
                logger.log({
                    level: 'error',
                    message: 'Invalid token'
                });
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: error.message,
                    message: "Invalid token"
                });
            }
            next();
        })
    } catch (error) {
        logger.log({
            level: 'error',
            message: 'Error while verifying token'
        });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            message: "Error while verifying token"
        })
    }
}

module.exports = { verifyToken: verifyToken };