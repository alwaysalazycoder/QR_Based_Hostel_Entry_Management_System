const catchAsyncError = require("../middleware/catchAsyncError");
const Entry = require("../models/entryModel");
const ApiFeatures = require("../utils/apiFeatures");

exports.createEntry = catchAsyncError(async (req, res, next) => {

    let existingEntry = await Entry.find({ enrollment_no: req.user.enrollment_no, inEntry: false });
    console.log(existingEntry);

    if (existingEntry.length > 0) {

        const updateentry = await Entry.findOneAndUpdate({ enrollment_no: req.user.enrollment_no,inEntry : false }, { inEntry: true ,status : "completed"});

        const entry = await Entry.findById(updateentry._id);

        res.status(200).json({
            success: true,
            message: "updated in entry",
            entry,
        })
    }
    else {


        const { inEntry, outEntry, whereTo, toHome, fromHome, description } = req.body;
        const { name, enrollment_no, phoneNo, floor, room_no, email } = req.user;

        if (inEntry === true) {
            res.status(200).json({
                success: false,
                message: "Please do your first entry from in to out..."
            });
            next();
        }
        else {

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
                user: req.user,
            })
        }





        // }
    }

})


exports.getAllEntry = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 5;
    const apiFeature = new ApiFeatures(Entry, req.query).search().filter().pagination(resultPerPage);

    const entry = await apiFeature.query;

    res.status(200).json({
        success: true,
        message: "All entries",
        count: entry.length,
        entry,
    })
})

exports.getAllEntryby = catchAsyncError(async (req, res, next) => {
    const entry = await Entry.find({ name: "Gaurav", enrollment_no: 200160107119 });

    if (!entry) {
        res.status(404).json({
            success: false,
            message: "such no dir"
        })
    }

    res.status(200).json({
        success: true,
        entry,
    })

})