const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");

const User = require("../models/userModel");
const Admin = require("../models/adminModel");




// 🔥 Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, enrollment_no, room_no, floor } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        enrollment_no,
        room_no,
        floor,
        profile: {
            public_id: "sample_id",
            url: "sample_url"
        },
        ID_card: {
            public_id: "sample_id",
            url: "sample_url"
        }

    });


    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
        user,
    })
});

// 🔥 Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter both email or password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    sendToken(user, 200, res);

})

// 🔥 logout user
exports.logOut = catchAsyncError(async (req, res, next) => {
    
    res.cookie('token', null, {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
})






// 🔥 Register Admin
exports.registerAdmin = catchAsyncError(async (req, res, next) => {
    
    const { name, email, password, role } = req.body;

    const admin = await Admin.create({
        name, email, password, role,
    })

    const token = admin.getJWTToken();
    res.status(200).json({
        success: true,
        token,
        admin,
    })
})

// 🔥 Login Admin
exports.loginAdmin = catchAsyncError(async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter both email or password", 400));
    }
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 401));
    }

    sendToken(admin, 200, res);
})

// 🔥 logout Admin
exports.logOutAdmin = catchAsyncError(async (req, res, next) => {
    
    res.cookie('token', null, {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
})