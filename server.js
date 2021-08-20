const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bootcampRoute = require("./routes/bootcampRoutes");
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

app.use("/api/v1/bootcamp", bootcampRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.bgBlue);
  connectDB();
});
