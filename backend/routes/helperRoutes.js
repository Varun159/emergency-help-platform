const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getAvailability, toggleAvailability, getNearbyHelpers, getNearbyHelperCount, getHelperStats } = require("../controllers/helperController");

router.get("/availability", protect, getAvailability);
router.patch("/availability", protect, toggleAvailability);
router.get("/nearby-count", protect, getNearbyHelperCount);
router.get("/stats", protect, getHelperStats);

module.exports = router;