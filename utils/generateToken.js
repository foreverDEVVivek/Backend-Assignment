const jwt=require('jsonwebtoken');

module.exports.generateToken=async(data)=>{
    try {
        const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:'600000'})
        return token;
    } catch (error) {
        res.status(500).json({success:false, message:error.message, extra:"Unable to generate token"});
    }
}