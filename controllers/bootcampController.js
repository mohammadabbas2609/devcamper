const asyncHandler = require("../middlewares/asyncHandler");
const BootcampModel = require("../models/bootcampModel");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
const getAllBootcamp = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedFiltering);
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
  const available = await BootcampModel.findOne({ user: req.user });

  if (available && req.role !== "admin") {
    return next(new ErrorResponse("You cannot create bootcamp twice"));
  }

  const bootcamp = await BootcampModel.create({ user: req.user, ...req.body });

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Update the Bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootcampModel.findById(req.params.id).select("user");

  if (!bootcamp) {
    next(new ErrorResponse("Bootcamp not found", 404));
  }

  if (bootcamp.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await BootcampModel.findByIdAndUpdate(bootcamp._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Delete a bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id).select("user");

  if (!bootcamp) {
    next(new ErrorResponse("Bootcamp not found", 404));
  }

  if (bootcamp.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc     Get Bootcamp within certain radius
//@route    GET /api/v1/bootcamp/radius/:zipcode/:distance
//@access   Public
const getBootcampWithinDistance = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3963 miles / 6378 km

  const radius = distance / 3963;

  const bootcamps = await BootcampModel.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc     Uploading the photo of the bootcamp
//@route    POST /api/v1/bootcamp/:id/photo
//@access   Private
const uploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id).select("user");
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = Object.values(req.files)[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return next(new ErrorResponse("Please upload only jpeg,png,jpg images"));
  }

  const fileName = `${Date.now()}${path.extname(file.name)}`;
  const uploadPath = path.resolve() + "/public/uploads/" + fileName;

  file.mv(uploadPath, err => {
    if (err) {
      return next(err.message, 403);
    }
  });

  const updateWithPhoto = await BootcampModel.findByIdAndUpdate(
    bootcamp._id,
    {
      photo: fileName,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updateWithPhoto,
  });
});

module.exports = {
  getAllBootcamp,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampWithinDistance,
  uploadPhoto,
};
