const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getNearbyHelpers } = require("../controllers/helperController");
const {
  createEmergency,
  getMyRequests,
  getNearbyEmergencies,
  acceptEmergency,
  getAcceptedEmergencies,
  completeEmergency
} = require("../controllers/emergencyController");


router.post("/create", protect, createEmergency);

router.get("/nearby-helpers", protect, getNearbyHelpers);

router.get("/my-requests", protect, getMyRequests);

router.get("/nearby", getNearbyEmergencies);

router.get("/accepted", protect, getAcceptedEmergencies);

router.patch("/accept/:requestId", protect, acceptEmergency);

router.patch("/complete/:requestId", protect, completeEmergency);

module.exports = router;