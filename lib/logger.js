const winston = require('winston');
var moment = require('moment');
var util = require('./utils');

class TimestampFirst {
    constructor(enabled = true) {
        this.enabled = enabled;
    }
    transform(obj) {
        if (this.enabled) {
            return Object.assign({ timestamp: obj.timestamp }, obj);
        }
        return obj;
    }
}

var myFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), new TimestampFirst(true), winston.format.json()
);

const logger = winston.createLogger({
    level: 'info',
    // format: winston.format.json(),
    format: myFormat,
    transports: [
        new winston.transports.File({ filename: './logs/error_' + moment(new Date()).format(util.logDateFormat()) + '.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined_' + moment(new Date()).format(util.logDateFormat()) + '.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}
module.exports = logger;