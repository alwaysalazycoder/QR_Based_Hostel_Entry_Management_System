const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");

const User = require("../models/userModel");
const Admin = require("../models/adminModel");




// 🔥 Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, enrollment_no, room_no, floor ,phoneNo} = req.body;

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
        },phoneNo,

    });

    sendToken(user, 200, res);
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

// 🔥 get user details...
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const id = req.user.id;
    const user = await User.findById(id);

    res.status(200).json({
        success: true,
        user,
    })
})

// 🔥 update user data or details
exports.updateUser = catchAsyncError(async (req, res, next) => {

    const { enrollment_no } = req.body;
    const { name, room_no,phoneNo } = req.body;

    const user = await User.findOne({ enrollment_no });

    user.name = name;
    user.room_no = room_no;
    user.phoneNo = phoneNo;

    user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        user,
        name, email,
        phoneNo,

    })
})

// 🔥 get all users -- Admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({});

    res.status(200).json({
        success: true,
        users
    })
})

// 🔥 delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const { enrollment_no } = req.body;
    const user = await User.findOneAndDelete({ enrollment_no });

    if (!user) {
        next(new ErrorHandler("User with given id doesnot exist", 404))
    }

    res.status(200).json({
        success: true,
        message: "user delete successfully ",
        user,
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




// 🔥 forgot password
exports.forgotPassword = (option) => {

    return catchAsyncError((async (req, res, next) => {

        const email = req.body.email;
        let user;
        if (option === "user") {
            user = await User.findOne({ email });
        }
        else {
            user = await Admin.findOne({ email });
        }

        // const user = await option.findOne({email});

        if (!user) {
            return next(new ErrorHandler("User not found !!", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `Your password reset url is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it...`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Hostel mangement system password recovery`,
                message: message,

            });

            res.status(200).json({
                success: true,
                message: `Email successfully sent to ${user.email}`,
            })
        }
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(err.message, 500));
        }
    })
    )
}

// 🔥 reset password
exports.resetPassword = (option) => {
    return catchAsyncError(async (req, res, next) => {
        let user;
        console.log(req.params.token);
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        if (option === "user") {
            user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            })
        }
        else {
            user = await Admin.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            })
        }

        if (!user) {
            return next(new ErrorHandler("Reset token is invalid or expired", 400));
        }
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Reset token is invalidd or expired", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        sendToken(user, 200, res);
    })
}

