const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
   
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findOne(decodeData._id);

    next()

});

exports.isAuthorisedRole = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 403))
        }
        
        next();
    }
}

