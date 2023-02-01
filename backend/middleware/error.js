const ErrorHandler = require("../utils/errorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode == err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong mongodb id error ...
    if(err.name === "CastError"){
        const message = `Resource not found or wrong id. Invalid : ${err.path}. Cast Error...`;
        err = new ErrorHandler(message,400); 
    }

    res.status(err.statusCode).json({
        success : false,
        error : err,
        errorStack : err.stack,
        message : err.message,
    })
}