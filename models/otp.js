const mongoose=require('mongoose');

const otpSchema=mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
      type:String,
      match: [/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, 'Email must be a valid Email.'],
      required:true,
    },
    createdAt:{
      type:Date,
      default:Date.now(),
      expires:600 //10 minutes (600 seconds)
    }
})

const Otp=mongoose.model("otp",otpSchema);

module.exports=Otp;