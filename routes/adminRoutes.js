const router = require("express").Router();
const protectedRoute = require("../middlewares/protectedRoute");
const restrictAccess = require("../middlewares/restrictAccess");
const advanceFiltering = require("../middlewares/advanceFiltering");
const UserModel = require("../models/userModel");
const {
  deleteUser,
  getAllUsers,
  updateUser,
  getUser,
} = require("../controllers/adminController");

router.get(
  "/users",
  protectedRoute,
  restrictAccess("admin"),
  advanceFiltering(UserModel),
  getAllUsers
);

router
  .route("/user/:id")
  .get(protectedRoute, restrictAccess("admin"), getUser)
  .put(protectedRoute, restrictAccess("admin"), updateUser)
  .delete(protectedRoute, restrictAccess("admin"), deleteUser);

module.exports = router;
