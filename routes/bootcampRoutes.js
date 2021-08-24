const express = require("express");
const {
  getAllBootcamp,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampWithinDistance,
  uploadPhoto,
} = require("../controllers/bootcampController");
const advancedFiltering = require("../middlewares/advanceFiltering");
const router = express.Router();

const BootcampModel = require("../models/bootcampModel");
const protectedRoute = require("../middlewares/protectedRoute");
const restrictAccess = require("../middlewares/restrictAccess");
const courseRouter = require("./courseRoutes");
// Reroute into other resource router
router.use("/:bootcampId/course", courseRouter);

router
  .route("/")
  .get(advancedFiltering(BootcampModel, "courses"), getAllBootcamp)
  .post(protectedRoute, restrictAccess("publisher", "admin"), createBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampWithinDistance);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protectedRoute, restrictAccess("publisher", "admin"), updateBootcamp)
  .delete(protectedRoute, restrictAccess("publisher", "admin"), deleteBootcamp);

router.post(
  "/:id/photo",
  protectedRoute,
  restrictAccess("publisher", "admin"),
  uploadPhoto
);

module.exports = router;
