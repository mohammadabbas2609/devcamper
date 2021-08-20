const asyncHandler = require("../middlewares/asyncHandler");
const BootcampModel = require("../models/bootcampModel");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
const getAllBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootcampModel.find({});

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamp/:id
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Create a new bootcamp
//@route    POST /api/v1/bootcamp
//@access   Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Update the Bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!bootcamp) {
    next(new ErrorResponse("Bootcamp not found", 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Delete a bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);

  if (!bootcamp) {
    next(new ErrorResponse("Bootcamp not found", 404));
  }

  await BootcampModel.findByIdAndDelete(bootcamp._id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getAllBootcamp,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
