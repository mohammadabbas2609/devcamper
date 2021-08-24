const asyncHandler = require("../middlewares/asyncHandler");
const UserModel = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

//@desc     Get all Users
//@route    GET /api/v1/admin/users
//@access   Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedFiltering);
});

//@desc     Get Single User
//@route    GET /api/v1/admin/user/:id
//@access   Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Update user
//@route    PUT /api/v1/admin/user/:id
//@access   Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id).select("-password");

  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Delete user
//@route    DELTE /api/v1/admin/user/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }

  await user.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
