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


module.exports = connectDatabase;
