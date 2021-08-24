const asyncHandler = require("../middlewares/asyncHandler");
const CourseModel = require("../models/courseModel");
const BootcampModel = require("../models/bootcampModel");
const ErrorResponse = require("../utils/errorResponse");

//@desc     Get courses
//@route    GET /api/v1/course
//@route    GET /api/v1/bootcamp/:bootcampId/course
//@access   Public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await CourseModel.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedFiltering);
  }
});

//@desc   Create a course
//@route  POST /api/v1/bootcamp/:bootcampId/course
//@access Private
const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user;

  const bootcamp = await BootcampModel.findById(req.params.bootcampId).select(
    "user"
  );

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.bootcampId} not found`)
    );
  }

  if (bootcamp.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to create course in this bootcamp`,
        401
      )
    );
  }

  const course = await CourseModel.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc   Get single course
//@route  GET /api/v1/course/:id
//@access Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} doesnt exists`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc   Update a course
//@route  PUT /api/v1/course/:id
//@access Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await CourseModel.findById(req.params.id).select("user");

  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} doesnt exists`, 404)
    );
  }

  if (course.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to update course in this bootcamp`,
        401
      )
    );
  }

  course = await CourseModel.findByIdAndUpdate(course._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc   Delete a course
//@route  DELETE /api/v1/course/:id
//@access Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} doesnt exists`, 404)
    );
  }

  if (course.user.toString() !== req.user && req.role !== "admin") {
    return next(
      new ErrorResponse(
        `${req.user} is not authorized to delete course in this bootcamp`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createCourse,
};
