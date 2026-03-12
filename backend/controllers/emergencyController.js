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

const io = getIO();

io.emit("newEmergency", emergency);

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
}).sort({ createdAt: -1 });

res.json(requests);
console.log(req.user);

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

const emergencies = await EmergencyRequest.find({ status:"open" }).limit(20);

res.json(emergencies);

}catch(err){

res.status(500).json({message:"Error loading emergencies"});

}

};