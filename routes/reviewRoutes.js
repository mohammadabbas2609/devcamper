const router = require("express").Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createReview,
} = require("../controllers/reviewController");
const advancedFiltering = require("../middlewares/advanceFiltering");
const protectedRoute = require("../middlewares/protectedRoute");
const restrictAccess = require("../middlewares/restrictAccess");
const ReviewModel = require("../models/reviewModel");

router
  .route("/")
  .get(
    advancedFiltering(ReviewModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protectedRoute, restrictAccess("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protectedRoute, restrictAccess("user", "admin"), updateReview)
  .delete(protectedRoute, deleteReview);

module.exports = router;
