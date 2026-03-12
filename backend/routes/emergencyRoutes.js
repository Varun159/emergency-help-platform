const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { acceptEmergency } = require("../controllers/emergencyController");
const { getNearbyHelpers } = require("../controllers/helperController");
const { createEmergency, getMyRequests, getNearbyEmergencies } = require("../controllers/emergencyController");


router.post("/create", protect, createEmergency);

router.get("/nearby-helpers", protect, getNearbyHelpers);

router.get("/my-requests", protect, getMyRequests);

router.patch("/accept/:requestId", protect, acceptEmergency);

router.get("/nearby", getNearbyEmergencies);

module.exports = router;