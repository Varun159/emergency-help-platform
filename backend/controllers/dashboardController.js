const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {

  try {

    const openRequests = await EmergencyRequest.countDocuments({ status: "open" });
    const resolvedRequests = await EmergencyRequest.countDocuments({ status: "resolved" });

    // Real nearby helpers count using user's stored location
    let nearbyHelpers = 0;

    try {
      const user = await User.findById(req.user.id).select("location");

      if (user && user.location && user.location.coordinates &&
          user.location.coordinates[0] !== 0 && user.location.coordinates[1] !== 0) {

        nearbyHelpers = await User.countDocuments({
          _id: { $ne: req.user.id },
          role: { $in: ["helper", "both"] },
          availability_status: true,
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: user.location.coordinates
              },
              $maxDistance: 10000 // 10km radius
            }
          }
        });

      } else {
        // Fallback: count all available helpers
        nearbyHelpers = await User.countDocuments({
          role: { $in: ["helper", "both"] },
          availability_status: true
        });
      }
    } catch (geoErr) {
      // If geo query fails (e.g. no 2dsphere index match), fallback
      console.log("Geo query fallback:", geoErr.message);
      nearbyHelpers = await User.countDocuments({
        role: { $in: ["helper", "both"] },
        availability_status: true
      });
    }

    res.json({
      openRequests,
      resolvedRequests,
      nearbyHelpers
    });

  } catch (err) {

    res.status(500).json({ message: "Error loading stats" });

  }

};

module.exports = { getDashboardStats };