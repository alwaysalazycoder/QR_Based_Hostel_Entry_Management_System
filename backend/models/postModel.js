const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    name: {
        type: String,
    },
    date : {
        type : Date,
        default : new Date(),
    }

},
    { timestamps: true }
);

const PostModel = new mongoose.model('Post', postSchema);
module.exports = PostModel;