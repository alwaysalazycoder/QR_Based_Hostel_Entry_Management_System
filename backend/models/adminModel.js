const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


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
    }
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



module.exports = new mongoose.model("AdminModel",adminSchema);