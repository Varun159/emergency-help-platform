const User = require("../models/User");


// Get current availability status
exports.getAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("availability_status");
    res.json({ availability: user.availability_status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Toggle helper availability
exports.toggleAvailability = async (req, res) => {

try {

const user = await User.findById(req.user.id);

user.availability_status = !user.availability_status;

await user.save();

res.json({
message: "Availability updated",
availability: user.availability_status
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};



// Get nearby helpers
exports.getNearbyHelpers = async (req, res) => {

try {

const helpers = await User.find({
role: "helper",
availability_status: true
}).select("name location trust_score availability_status createdAt");

res.json(helpers);

} catch (error) {

res.status(500).json({ error: error.message });

}

};

const EmergencyRequest = require("../models/EmergencyRequest");


// Get count of nearby available helpers
exports.getNearbyHelperCount = async (req, res) => {

try {

const count = await User.countDocuments({
  role: "helper",
  availability_status: true
});

res.json({ count });

} catch (error) {

res.status(500).json({ error: error.message });

}

};



// Get helper stats (accepted, completed, trust score)
exports.getHelperStats = async (req, res) => {

try {

const user = await User.findById(req.user.id).select("trust_score");

const accepted = await EmergencyRequest.countDocuments({
  accepted_by: req.user.id,
  status: "accepted"
});

const completed = await EmergencyRequest.countDocuments({
  accepted_by: req.user.id,
  status: "resolved"
});

const nearby = await EmergencyRequest.countDocuments({
  status: "open"
});

res.json({
  nearby,
  accepted,
  completed,
  trust_score: user.trust_score || 0
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};