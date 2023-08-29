const express = require("express");
const app = express();
const morgan = require("morgan");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { errorResponse } = require("./controllers/responseController");

const seedRouter = require("./routers/seedRouter");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");

const rateLimiter = rateLimit({
  windowMS: 1 * 60 * 1000, // 1 minute
  max: 15,
  message: "Too many request from the this IP.Please try again later",
});

app.use(morgan("dev"));
app.use(xssClean());
app.use(rateLimiter);
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);



//client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

//server error handling-> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
