const otpGenerator = require('otp-generator');

module.exports = {
    responseGenerators: function (responseData, responseStatusCode, responseStatusMsg, responseErrors, token) {
        const responseJson = {}
        responseJson['data'] = responseData
        responseJson['status_code'] = responseStatusCode
        responseJson['status_message'] = responseStatusMsg
        // errors
        if (responseErrors === undefined) {
            responseJson['response_error'] = []
        } else {
            responseJson['response_error'] = responseErrors
        }
        // token
        if (token !== undefined) {
            responseJson['token'] = token
        }
        return responseJson
    },

    responsevalidation: function (responseStatusCode, responseStatusMsg, responseErrors) {
        const responsevalidationJson = {}
        responsevalidationJson['status_code'] = responseStatusCode
        responsevalidationJson['status_message'] = responseStatusMsg
        // errors
        if (responseErrors === undefined) {
            responsevalidationJson['response_error'] = []
        } else {
            responsevalidationJson['response_error'] = responseErrors
        }
        return responsevalidationJson;
    },

    dateFormat: function () {
        return "YYYY-MM-DD HH:mm:ss";
    },

    logDateFormat: function () {
        return "DD-MM-YYYY";
    },
    
    generateOTP(){
        return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    }
}