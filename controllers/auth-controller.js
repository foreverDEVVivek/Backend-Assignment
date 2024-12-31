const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendConfirmationMail = require("../utils/sendMail.js");
const { generateToken } = require("../utils/generateToken.js");
const UserInfo = require("../models/userInfo.js");

const register = async (req, res) => {
  try {

    //Molding it into data
    const data = {
      username: req.body.username,
      email: req.body.email,
      password:req.body.password,
    };

    //Storing the user and sending response
    const newUser = await User.create(data);

    //Sending an email for confirmation
    await sendConfirmationMail(data.email);
    
    //Sending the response
    res
      .status(201)
      .json({
        success: true,
        message: "Registration successful",
        token: await newUser.generateJsonWebToken(),
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.status(200).json({
      success: true,
      message: "Log In Successfully!",
      token: await user.generateJsonWebToken(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: error.message });
  }
};



const validateAuthToken = async (req, res) => {
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "").trim();
    const verifiedUser = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    if (verifiedUser) {
      return res.status(200).json({ success: true, message: "Valid Token" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = { login, register, validateAuthToken };
