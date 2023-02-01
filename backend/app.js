const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

// middlewares
app.use(express.json());
app.use(errorMiddleware);

//Route Imports
const users = require("./routes/userRoutes");

// api call
app.use("/api/v1",users);  


module.exports = app;