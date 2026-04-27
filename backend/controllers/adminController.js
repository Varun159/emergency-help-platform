const User = require("../models/User");
const EmergencyRequest = require("../models/EmergencyRequest");
const Review = require("../models/Review");

/*
  ADMIN STATS
*/

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHelpers = await User.countDocuments({ role: { $in: ["helper", "both"] } });
    const totalRequesters = await User.countDocuments({ role: { $in: ["requester", "both"] } });

    const openRequests = await EmergencyRequest.countDocuments({ status: "open" });
    const acceptedRequests = await EmergencyRequest.countDocuments({ status: "accepted" });
    const resolvedRequests = await EmergencyRequest.countDocuments({ status: "resolved" });
    const totalRequests = await EmergencyRequest.countDocuments();

    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalHelpers,
      totalRequesters,
      openRequests,
      acceptedRequests,
      resolvedRequests,
      totalRequests,
      totalReviews
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
  GET ALL USERS (admin only)
*/

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
  GET ALL REQUESTS (admin only)
*/

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find()
      .populate("requester_id", "name email phone")
      .populate("accepted_by", "name email phone")
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
  GET ALL REVIEWS (admin only)
*/

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer_id", "name email")
      .populate("helper_id", "name email")
      .populate("request_id", "category description")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
