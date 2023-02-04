const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

// middlewares
app.use(express.json());
app.use(cookieParser()); // for parsing cookies..
app.use(errorMiddleware);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

//Route Imports
const users = require("./routes/userRoutes");
const entries = require('./routes/entryRoutes');

// api call
app.use("/api/v1", users);
app.use("/api/v1",entries);

module.exports = app;
