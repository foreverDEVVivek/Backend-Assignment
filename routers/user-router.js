const express = require("express");
const Router = express.Router();
const userController = require('../controllers/user-controller.js')
const {validateAuthToken}=require('../middleware/auth-middleware.js')
const {isUserValid,doUserExists}=require('../middleware/user-middleware.js')

//To get all users details like their name and image
Router.route('/get-all-users')
.get(validateAuthToken,isUserValid,userController.getAllUsers)

//To get your details
Router.route('/get-all-users/:userId')
.get(validateAuthToken,isUserValid,userController.getYourDetails)

Router.route('/get-all-users/:userId/add-friend/:friendId')
.post(validateAuthToken,isUserValid,doUserExists,userController.addFriend)

Router.route('/get-all-users/:userId/remove-friend/:friendId')
.delete(validateAuthToken,isUserValid,doUserExists,userController.removeFriend)

module.exports=Router;