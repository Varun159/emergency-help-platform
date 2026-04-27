const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getAllUsers,
  getAllRequests,
  getAllReviews
} = require("../controllers/adminController");

// Admin role guard middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/requests", protect, adminOnly, getAllRequests);
router.get("/reviews", protect, adminOnly, getAllReviews);

module.exports = router;
