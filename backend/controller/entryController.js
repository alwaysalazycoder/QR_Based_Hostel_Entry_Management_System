const catchAsyncError = require("../middleware/catchAsyncError");
const Entry = require("../models/entryModel");
const ApiFeatures = require("../utils/apiFeatures");

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
        user : req.user
    })
})


exports.getAllEntry = catchAsyncError(async(req,res,next)=>{

    const apiFeature = new ApiFeatures(Entry.find(),req.query).search();

    const entry = await apiFeature.query;

    res.status(200).json({
        success : true,
        message : "All entries",
        count : entry.length,
        entry,
    })
})

exports.getAllEntryby = catchAsyncError(async(req,res,next)=>{
    const entry = await Entry.find({name : "Gaurav" ,enrollment_no : 200160107119});

    if(!entry){
        res.status(404).json({
            success : false,
            message : "such no dir"
        })
    }

    res.status(200).json({
        success : true,
        entry,
    })

})