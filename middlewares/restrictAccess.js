const ErrorResponse = require("../utils/errorResponse");

const restrictAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(
        new ErrorResponse(`${req.role} role cannot access this route`, 403)
      );
    }

    next();
  };
};

module.exports = restrictAccess;
