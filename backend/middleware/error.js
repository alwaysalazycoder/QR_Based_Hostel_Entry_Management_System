const ErrorHandler = require("../utils/errorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode == err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong mongodb id error ...
    if(err.name === "CastError"){
        const message = `Resource not found or wrong id. Invalid : ${err.path}. Cast Error...`;
        err = new ErrorHandler(message,400); 
    }

    // Wrong jwt token error ...
    if(err.name === "JsonWebTokenError"){
        const message = `Invalid jwt token please look upto it.`;
        err = new ErrorHandler(message,400); 
    }
    
    // Jwt expire error ...
    if(err.name === "TokenExpiredError"){
        const message = `Invalid token or token expired.`;
        err = new ErrorHandler(message,400); 
    }

    // mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400);
    }

   
    res.status(err.statusCode).json({
        success : false,
        error : err,
        errorStack : err.stack,
        message : err.message,
    })
}