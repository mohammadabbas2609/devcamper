const asyncHandler = require("../middlewares/asyncHandler");
const ReviewModel = require("../models/reviewModel");
const ErrorResponse = require("../utils/errorResponse");
const BootcampModel = require("../models/bootcampModel");

//@desc     Get all reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1/bootcamp/:bootcampId/reviews
//@access   Public
const getReviews = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    const reviews = await ReviewModel.find({
      bootcamp: req.params.bootcampId,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  }

  res.status(200).json(res.advancedFiltering);
});

//@desc     Create a review for existing bootcamp
//@route    POST /api/v1/bootcamp/:bootcampId/reviews
//@access   Private
const createReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id ${req.params.bootcampId} doesnt exists`,
        404
      )
    );
  }

  const review = await ReviewModel.create({
    ...req.body,
    user: req.user,
    bootcamp: bootcamp._id,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc     Get a single review
//@route    GET /api/v1/reviews/:id
//@access   Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await ReviewModel.findById(req.params.id)
    .populate("user", "name")
    .populate("bootcamp", "name");

  if (!review) {
    return next(
      new ErrorResponse(`Review with id ${req.params.id} doesnt exists`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc     Update a review
//@route    PUT /api/v1/reviews/:id
//@access   Private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await ReviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with id ${req.params.id} doesnt exists`, 404)
    );
  }

  if (req.user !== review.user.toString() && req.role !== "admin") {
    return next(new ErrorResponse("You cannot update this review", 403));
  }

  review.title = req.body.title || review.title;
  review.text = req.body.text || review.text;
  review.rating = +req.body.rating || review.rating;

  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc     Delete a review
//@route    DELETE /api/v1/reviews/:id
//@access   Private
const deleteReview = asyncHandler(async (req, res, next) => {
  let review = await ReviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with id ${req.params.id} doesnt exists`, 404)
    );
  }

  if (req.user !== review.user.toString() && req.role !== "admin") {
    return next(new ErrorResponse("You cannot delete this review", 403));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
};
