const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

    const {token} = req.cookies;
 
    if (!token || token === "j:null") {
        res.status(404).json({
            success : false,
            message : "Please Login to access this resource"
        })
    }
    else if(token){

        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded DAta : ", decodeData);
        
        req.user = await user.findById(decodeData.id);
        next()
    }


});

exports.isAuthorisedRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 403))
        }
        
        next();
    }
}

