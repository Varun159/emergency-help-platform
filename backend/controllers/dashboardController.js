const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");

const getDashboardStats = async (req,res)=>{

try{

const openRequests = await EmergencyRequest.countDocuments({ status:"open" });

const resolvedRequests = await EmergencyRequest.countDocuments({ status:"resolved" });

const nearbyHelpers = await User.countDocuments({ role:"helper" });

res.json({
openRequests,
resolvedRequests,
nearbyHelpers
});

}catch(err){

res.status(500).json({message:"Error loading stats"});

}

};

module.exports = { getDashboardStats };