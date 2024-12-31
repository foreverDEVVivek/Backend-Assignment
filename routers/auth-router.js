const express = require("express");
const Router = express.Router();
const {
  validateRegister,
  validateIsExist,
  validateLogin,
  validateAuthToken,
  validateIsRegistered,
  requestLimiter,
} = require("../middleware/auth-middleware.js");
const authController = require("../controllers/auth-controller");


//Register route it check user is already registered and send Confirmation mail ....
Router.route("/register").post(
  requestLimiter,
  validateRegister,
  validateIsExist,
  authController.register
);

//Login Route to validate login credentials and send otp for further login process...
Router.route("/login").post(
  requestLimiter,
  validateLogin,
  validateIsRegistered,
  authController.login
);


//Auth route to validate the token...
Router.route("/validate-token").get(
  validateAuthToken,
  authController.validateAuthToken
);
module.exports = Router;
