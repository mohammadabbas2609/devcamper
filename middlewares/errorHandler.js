const errorHandler = (err, req, res, next) => {
  // !Error in console
  console.log(err);

  // !Mongoose Unique Key Error
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `${Object.values(err.keyValue)[0]} already exists`;
  }

  // !Mongoose Validation Error
  if (err.name === "ValidationError") {
    Object.values(err.errors).map(({ properties }) => {
      err.statusCode = 400;
      err.message = properties.message;
    });
  }

  //   !Mongoose Bad ObjectID
  if (err.name === "CastError") {
    err.statusCode = 404;
    err.message = `Unable to find resource with id ${err.value}`;
  }

  //   !Sending Response with Errors
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server error",
  });
};

const notFound = (req, res, next) => {
  res.status(400).json({
    success: false,
    error: "Given address is not available",
  });
};

module.exports = {
  errorHandler,
  notFound,
};
