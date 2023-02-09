const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({

    inEntry: {
        type: Boolean,
        required: true,
    },

    outEntry: {
        type: Boolean,
    },

    whereTo: {  // complex,college,city,mess,gymkhana,home...
        type: String,
        // required: true,
    },

    toHome: Boolean,

    fromHome: Boolean,

    description: {
        type: String,
    },

    Date: {
        type: Date,
        default: new Date()
    },

    status : {
        type : String,
        default : "pending",
    },

    name: String,
    email: String,
    room_no: Number,
    phoneNo: Number,
    floor: String,
    enrollment_no: Number,

}, {
    timestamps: true,
}
)

const EntryModel = new mongoose.model("EntryModel", entrySchema);

module.exports = EntryModel;