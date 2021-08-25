const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookie = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const bootcampRoute = require("./routes/bootcampRoutes");
const courseRoute = require("./routes/courseRoutes");
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoutes");
const reviewRoute = require("./routes/reviewRoutes.js");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
// Loading dotenv
require("dotenv").config({});
const app = express();

// Accepting JSON
app.use(express.json());

// Using Morgan for development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// applying CORS
app.use(cors());

// Sanitizing Mongo Operators
app.use(mongoSanitize());

// Applying Security Headers
app.use(helmet());

// Preventing Cross-Site Scripting
app.use(xss());

// Rate Limiting the API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, //60 Minutes
  max: 150,
});

app.use(limiter);

// Prevent HTTP parameters pollution
app.use(hpp());

// Using express file upload for uploading images
app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
    limitHandler: function (req, res, next) {
      return res.status(400).json({
        success: false,
        error: "Please upload file less than 1MB",
      });
    },
  })
);

app.use(cookie());

// Setting up routes
app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.use("/api/v1/bootcamp", bootcampRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/reviews", reviewRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.bgBlue);
  connectDB();
});
