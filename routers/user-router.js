const express = require("express");
const Router = express.Router();
const userController=require('../controllers/user-controller.js');
const {validateAuthToken,validateRegister}=require('../middleware/auth-middleware.js')
const {authorizeRole}=require('../middleware/roleCheck-middleware.js');
const {isUserValid}=require('../middleware/user-middleware.js')

//To get your own details e.g. profile
Router.route('/get-profile/:userId')
.get(validateAuthToken,authorizeRole(["viewProfile"]),isUserValid,userController.getProfileDetails)


module.exports=Router;