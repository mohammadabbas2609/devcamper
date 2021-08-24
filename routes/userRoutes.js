const express = require("express");
const {
  register,
  login,
  myProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const protectedRoute = require("../middlewares/protectedRoute");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protectedRoute, myProfile);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/logout", protectedRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
module.exports = router;
