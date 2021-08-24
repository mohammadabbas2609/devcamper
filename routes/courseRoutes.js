const express = require("express");
const {
  deleteCourse,
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
} = require("../controllers/courseController");
const advancedFiltering = require("../middlewares/advanceFiltering");
const protectedRoute = require("../middlewares/protectedRoute");
const restrictAccess = require("../middlewares/restrictAccess");
const CourseModel = require("../models/courseModel");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedFiltering(CourseModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protectedRoute, restrictAccess("publisher", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protectedRoute, restrictAccess("publisher", "admin"), updateCourse)
  .delete(protectedRoute, restrictAccess("publisher", "admin"), deleteCourse);

module.exports = router;
