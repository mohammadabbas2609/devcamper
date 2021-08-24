const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./asyncHandler");

const protectedRoute = asyncHandler((req, res, next) => {
  let token = req.headers.authorization;

  if (!token || token === null) {
    return next(new ErrorResponse("Please login to access this route", 403));
  }

  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new ErrorResponse("Provided credentials are incorrect", 403));
    }

    req.user = decoded.userId;
    req.role = decoded.role;

    return next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized access", 401));
  }
});

module.exports = protectedRoute;
