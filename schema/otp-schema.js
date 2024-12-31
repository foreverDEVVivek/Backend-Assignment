const Joi = require('joi');


const otpSchema= Joi.object({
    otp: Joi.string()
      .pattern(new RegExp("^[0-9]{6}$"))
      .required()
      .messages({
        "string.pattern.base": "OTP must be 6 digits.",
      }),
  }).required();

module.exports = otpSchema;
  