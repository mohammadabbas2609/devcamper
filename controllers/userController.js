const asyncHandler = require("../middlewares/asyncHandler");
const UserModel = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const ttl = 1000 * 60 * 60;

//@desc     Register user
//@route    POST /api/v1/user/register
//@access   Public
const register = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create(req.body);

  sendTokenResponse(user, 200, res);
});

//@desc     Login user
//@route    POST /api/v1/user/login
//@access   Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please enter email and password", 400));
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(
      new ErrorResponse(`User with email ${email} doesnt exists`, 404)
    );
  }

  const verifyPass = await user.verifyPassword(password);

  if (!verifyPass) {
    return next(new ErrorResponse("Please enter correct password", 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc     My profile
//@route    GET /api/v1/user/me
//@access   Private
const myProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user).select("-password");

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Update profile
//@route    PUT /api/v1/update-profile
//@access   Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user).select("-password");

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

//@desc     Logout user
//@route    GET /api/v1/user/logout
//@access   Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, { maxAge: 1, httpOnly: true });
  res.status(200).json({
    success: true,
    token: null,
  });
});

//@desc     Forgot password handler
//@route    POST /api/v1/user/forgotpassword
//@access   Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "email"
  );

  if (!user) {
    return next(
      new ErrorResponse(`Email - ${req.body.email} doesnt exists`, 404)
    );
  }

  // Get reset token
  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/user/resetpassword/${resetToken}`;

  const message = `Youre receiving this email becuase you(or someone else) has requested
  the reset of password,Please make a PUT request to: \n\n ${resetURL}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    return res.status(200).json({
      success: true,
      data: "Email Sent",
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email coudnt be sent", 500));
  }
});

//@desc     Reset Password
//@route    PUT /api/v1/user/resetpassword/:resettoken
//@access   Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);
  const options = {
    maxAge: ttl,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
module.exports = {
  register,
  login,
  myProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
};
