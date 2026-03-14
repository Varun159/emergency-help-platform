const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const { getIO } = require("../sockets/socketHandler");

/*
CREATE EMERGENCY REQUEST
*/

exports.createEmergency = async (req, res) => {

try {

const { category, description, urgency_level, latitude, longitude } = req.body;

const emergency = await EmergencyRequest.create({

requester_id: req.user.id,

category,
description,
urgency_level,

location: {
type: "Point",
coordinates: [longitude, latitude]
}

});

// Get requester details for notification
const requester = await User.findById(req.user.id).select("name phone location institution address");

const io = getIO();

// Emit to all connected users (helpers will pick this up)
io.emit("newEmergency", {
  ...emergency.toObject(),
  requester_id: requester,
  notification: {
    message: `New ${urgency_level} ${category} emergency nearby!`,
    type: "new_emergency"
  }
});

res.status(201).json({
message: "Emergency request created",
emergency
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};



/*
FIND NEARBY HELPERS
*/

exports.getNearbyHelpers = async (req, res) => {

try {

const { latitude, longitude } = req.query;

const helpers = await User.find({

role: "helper",
availability_status: true,

location: {

$near: {

$geometry: {
type: "Point",
coordinates: [parseFloat(longitude), parseFloat(latitude)]
},

$maxDistance: 5000

}

}

});

res.json({
helpers
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};



/*
GET MY REQUESTS
*/

exports.getMyRequests = async (req, res) => {
console.log("USER:", req.user);

try {

const requests = await EmergencyRequest.find({
requester_id: req.user.id
}).populate("accepted_by", "name phone location institution address").sort({ createdAt: -1 });

res.json(requests);

} catch (error) {

res.status(500).json({ message: "Error fetching requests" });

}

};



/*
HELPER ACCEPT EMERGENCY REQUEST
*/

exports.acceptEmergency = async (req, res) => {

try {

const { requestId } = req.params;

const emergency = await EmergencyRequest.findById(requestId);

if (!emergency) {
return res.status(404).json({ message: "Emergency not found" });
}

if (emergency.status !== "open") {
return res.status(400).json({ message: "Emergency already accepted" });
}

emergency.accepted_by = req.user.id;
emergency.status = "accepted";

await emergency.save();

// Get full helper details for notification
const helper = await User.findById(req.user.id).select("name phone location institution address");

// Save notification to DB
const Notification = require("../models/Notification");
await Notification.create({
  request_id: emergency._id,
  helper_id: req.user.id,
  user_id: emergency.requester_id,
  message: `${helper.name} has accepted your ${emergency.category} emergency request`
});

// Emit real-time notification to the requester with full helper info
const io = getIO();
io.to(emergency.requester_id.toString()).emit("requestAccepted", {
  message: `${helper.name} has accepted your ${emergency.category} request!`,
  emergency,
  helper: {
    name: helper.name,
    phone: helper.phone,
    location: helper.location,
    institution: helper.institution,
    address: helper.address
  }
});

res.json({
message: "Emergency accepted successfully",
emergency
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};



/*
GET NEARBY EMERGENCIES
*/

exports.getNearbyEmergencies = async (req,res)=>{

try{

const emergencies = await EmergencyRequest.find({ status:"open" }).populate("requester_id", "name phone location institution address").sort({ createdAt: -1 }).limit(20);

res.json(emergencies);

}catch(err){

res.status(500).json({message:"Error loading emergencies"});

}

};



/*
GET ACCEPTED EMERGENCIES (for the logged-in helper)
*/

exports.getAcceptedEmergencies = async (req, res) => {

try {

const emergencies = await EmergencyRequest.find({
  accepted_by: req.user.id,
  status: "accepted"
}).populate("requester_id", "name phone location institution address").sort({ createdAt: -1 });

res.json(emergencies);

} catch (error) {

res.status(500).json({ message: "Error fetching accepted emergencies" });

}

};



/*
MARK EMERGENCY AS COMPLETED / RESOLVED
*/

exports.completeEmergency = async (req, res) => {

try {

const { requestId } = req.params;

const emergency = await EmergencyRequest.findById(requestId);

if (!emergency) {
  return res.status(404).json({ message: "Emergency not found" });
}

if (emergency.accepted_by.toString() !== req.user.id) {
  return res.status(403).json({ message: "Not authorized" });
}

emergency.status = "resolved";
await emergency.save();

// Increment helper trust score
await User.findByIdAndUpdate(req.user.id, { $inc: { trust_score: 1 } });

res.json({
  message: "Emergency marked as resolved",
  emergency
});

} catch (error) {

res.status(500).json({ error: error.message });

}

};