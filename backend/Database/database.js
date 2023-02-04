const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect("mongodb://localhost:27017/fruitsDB", {
        useNewUrlParser: true,
       
    }).then((data) => {
        console.log(`MonogoDB connected with server ${data.connection.host}`);
    }).catch((err) => {
        console.log("Error : ", err);
    })

}

mongoose.set('strictQuery', false);

const cxn = mongoose.connection

cxn
.on("open", () => console.log("mongoose is connected"))
.on("close", () => console.log("mongoose is disconnected"))
.on("error", (error) => console.log(error))


module.exports = connectDatabase;
