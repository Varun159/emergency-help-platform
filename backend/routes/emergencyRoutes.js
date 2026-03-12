const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { acceptEmergency } = require("../controllers/emergencyController");
const { getMyRequests } = require("../controllers/emergencyController");

const {
createEmergency,
getNearbyHelpers
} = require("../controllers/emergencyController");


router.post("/create", protect, createEmergency);

router.get("/nearby-helpers", protect, getNearbyHelpers);

router.get("/my-requests", protect, getMyRequests);

router.patch("/accept/:requestId", protect, acceptEmergency);


module.exports = router;