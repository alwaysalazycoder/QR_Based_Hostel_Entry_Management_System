const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :[true, "Please enter your name"],
        maxlength: [30, "Name length cannot exceed 30 character"],
        minLength: [4, "Name should have more than 4 character "],
    },
    email: {
        type: String,
        required: [true, " Enter your email Id"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password : {
        type : String,
        required: [true,"Please enter your password"],
        minLength:[8,"Password must be 8 character long"],
        select: false,
    },
    room_no : {
        type : Number,
        required : [true, "Enter your room no."]
    },
    enrollment_no : {
        type:Number,
        required : [true,"Enter your enrollment no."]
    },
    floor : {
        type : String,
        required: [true,"Enter your floor no."]
    },

    role : {
        type : String,
        default: "user"
    },
    ID_card : {
        public_id: {
            type : String,
            required : true,
        },
        url : {
            type : String,
            require: true,
        },
    },

    profile : {
        public_id : {
            type : String,
            required:[true,"Please enter public id"]
        },
        url : {
            type : String,
            required : true,
        }
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
});



// password encryption..
userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);

})

// JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//compare password
userSchema.methods.comparePassword = async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);

}
module.exports = mongoose.model("User",userSchema);