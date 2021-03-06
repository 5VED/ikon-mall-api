const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user/user.controller');
const userValidator = require('../../validator/user.validator');
const middleware = require('../../middlewares/verifyToken');

// Create user
router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

router.post('/signup', userValidator.SignUpValidator, userController.Signup);
router.post('/login', userValidator.LoginValidator, userController.Login);
router.post('/verifyotp', userController.VerifyOtp);
router.put('/resetpassword', middleware.verifyToken, userController.ChangePassword);
router.post('/address', middleware.verifyToken, userController.AddUserAddress);
router.delete('/address/:addressId', middleware.verifyToken, userController.DeleteAddress);
router.put('/address/:addressId', middleware.verifyToken, userController.UpdateAddress);
router.get('/address', middleware.verifyToken, userController.GetAllAddress);

module.exports = router