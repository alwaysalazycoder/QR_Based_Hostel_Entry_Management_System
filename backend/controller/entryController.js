const catchAsyncError = require("../middleware/catchAsyncError");
const Entry = require("../models/entryModel");

exports.createEntry = catchAsyncError(async (req, res, next) => {

    const { inEntry, outEntry, whereTo, toHome, fromHome, description} = req.body;
    const { name, enrollment_no, phoneNo, floor, room_no, email } = req.user;
    const entry = await Entry.create({
        inEntry,
        outEntry,
        whereTo,
        toHome,
        fromHome,
        description,
        // date,
        name,
        enrollment_no,
        phoneNo,
        floor,
        room_no,
        email,
        // time
    });

    res.status(200).json({
        success: true,
        message: "done entry done",
        entry,
    })
})