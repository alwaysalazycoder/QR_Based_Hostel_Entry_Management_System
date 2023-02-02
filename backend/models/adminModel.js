const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxLength : [30,"Please enter the name with maximum of 30 character"],
        minLength : [4,"Please enter the name with 4 or more charcter"]
    },
    role : {
        type : String,
        // required : true,
        default : "warden",
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail , "Please a valid email"],
        unique : true,
    },
    password : {
        type : String,
        required : true,
        maxLength : [15,"Please enter the name with maximum of 15 character"],
        minLength : [8,"Please enter the name with 8 or more charcter"]
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
})

// compare password without encryption
adminSchema.methods.comparePassword = async function (bodypassword){
    if (bodypassword == this.password) {
        return true;
    }
    else {
        return false
    }
}

// JWT token
adminSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

// generating password reset token
adminSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetPasswordToken to the schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 20 * 60 * 1000;

    return resetToken;

}



module.exports = new mongoose.model("AdminModel",adminSchema);