const asyncHandler = require("../middlewares/asyncHandler");
const BootcampModel = require("../models/bootcampModel");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamp
// @access  Public
const getAllBootcamp = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Field to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  // Loop over and remove field and delete them from reqQuery
  removeFields.forEach(field => {
    delete reqQuery[field];
  });

  // Create query String
  let queryStr = JSON.stringify(reqQuery);

  // Create operaters like (gt,gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = BootcampModel.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const selectFields = req.query.select.split(",").join(" ");
    query = query.select(selectFields);
  }

  // Sort Fields
  if (req.query.sort) {
    const sortFields = req.query.sort.split(",").join(" ");
    query = query.sort(sortFields);
  } else {
    query = query.sort("-createdAt");
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootcampModel.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
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

module.exports = {
  getAllBootcamp,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampWithinDistance,
};
