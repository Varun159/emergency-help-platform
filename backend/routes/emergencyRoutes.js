const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { acceptEmergency } = require("../controllers/emergencyController");

const {
createEmergency,
getNearbyHelpers
} = require("../controllers/emergencyController");


router.post("/create", protect, createEmergency);

router.get("/nearby-helpers", protect, getNearbyHelpers);

router.patch("/accept/:requestId", protect, acceptEmergency);


module.exports = router;