const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../models/postModel");
const ErrorHandler = require("../utils/errorHandler");


exports.createPost = catchAsyncError(async(req,res,next)=>{

    const {subject,description} = req.body;
    const { name, enrollment_no, phoneNo, floor, room_no, email } = req.user;
    // let name = "Gaurav";

    console.log(req.user);

    const post = await Post.create({
        subject,name,description
    });

    res.status(200).json({
        success : true,
        message : "Post created",
        post
    })
});

exports.getPost = catchAsyncError(async(req,res,next)=>{
    const post = await Post.find({});

    if(!post){
        return next(new ErrorHandler("Some error occured while fetching the data",400));
    }

    res.status(200).json({
        success : true,
        post
    })
});

exports.updatePost = catchAsyncError(async(req,res,next)=>{
    const {newSubject , newDescription} = req.body;

    let post = await Post.findById(req.params.id);

    if(!post){
        return next(new ErrorHandler("Post not found",404));
    }

    post = await Post.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true,
        useFindAndModify : true
    })
    res.status(200).json({
        success : true,
        post
    })
})

exports.deletePost = catchAsyncError(async(req,res,next)=>{
    
    const post = await Post.findById(req.params.id);
    
    if(!post){
        return next(new ErrorHandler("Product not found",400));
    }

    await post.remove();

    res.status(200).json({
        success : true,
        message : "Post deleted successfully...."
    })
})