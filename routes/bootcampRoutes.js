const express = require("express");
const {
  getAllBootcamp,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcampController");
const router = express.Router();

router.route("/").get(getAllBootcamp).post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
