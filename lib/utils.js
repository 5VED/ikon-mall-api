const jwt = require('jsonwebtoken');
const config = require("../config/mail.config.json");
const nodeMailer = require("nodemailer");
const logger = require('../lib/logger');
const CryptoJS = require('crypto-js');
const res = require('express/lib/response');

// let transporter = nodeMailer.createTransport({
//     host: config.setEmailSettings.Host,
//     port: config.setEmailSettings.Port,
//     secure: config.setEmailSettings.Secure,
//     requireTLS: config.setEmailSettings.RequireTLS,
//     auth: {
//         user: config.setEmailSettings.NotifyEmail.NotifyFromUserId,
//         pass: config.setEmailSettings.NotifyEmail.NotifyFromPassword
//     }
// });

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
    generateToken: function (user, secretKey) {
        user.date = Date.now
        let userDetails = {
            UserId: user.UserId,
            FirstName: user.FirstName
        }
        return jwt.sign({ user: userDetails }, secretKey.toString(), { expiresIn: '24h' })
    },

    SendMail(mailOptions) {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                // console.log(err)
                logger.log({
                    level: 'err',
                    message: 'Error while send mail ' + err
                })
            } else {
                // console.log(info);
                logger.log({
                    level: 'info',
                    message: 'Successfully send mail.'
                })
            }
        });
    },

    encryptFn(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'SecretKey').toString();
    },

    decryptFn(cipherText) {
        const bytes = CryptoJS.AES.decrypt(cipherText, 'SecretKey').toString(CryptoJS.enc.Utf8);
        return bytes;
    },

    async decryptJSON(req, res, next) {
        let decryptedData = CryptoJS.AES.decrypt(req.body.arg, 'SecretKey').toString(CryptoJS.enc.Utf8);
        if (Object.keys(req.body).length) {
            req.body = JSON.parse(decryptedData);
        } else {
            req.query = JSON.parse(decryptedData);
            req.params = JSON.parse(decryptedData);
        }
        next();
    },

    encryptPassword(data) {
        return CryptoJS.RC4Drop.encrypt(JSON.stringify(data), 'SecretKey', {
            drop: 3072 / 4
        }).toString();
    },

    decryptPassword(encrypted) {
        const plainPass = CryptoJS.RC4Drop.decrypt(encrypted, 'SecretKey', {
            drop: 3072 / 4
        }).toString(CryptoJS.enc.Utf8);
        return plainPass;
    },
    
    generateOTP(otp_length){
        let digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < otp_length; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      },

      async fast2sms({message,contactNumber }){
        try {
            const res = await fast2sms.sendMessage({
              authorization: '',
              message,
              numbers: [contactNumber],
            });
            console.log(res);
          } catch (error) {
           return res.status(500).json({message:error})
          }
      }
}