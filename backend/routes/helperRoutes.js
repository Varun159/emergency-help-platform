const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { toggleAvailability, getNearbyHelpers } = require("../controllers/helperController");

router.patch("/availability", protect, toggleAvailability);

module.exports = router;