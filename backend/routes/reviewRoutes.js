const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  submitReview,
  getReviewsForHelper,
  getReviewForRequest
} = require("../controllers/reviewController");

router.post("/:requestId", protect, submitReview);
router.get("/helper/:helperId", protect, getReviewsForHelper);
router.get("/request/:requestId", protect, getReviewForRequest);

module.exports = router;
