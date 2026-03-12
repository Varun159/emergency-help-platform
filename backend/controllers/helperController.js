const User = require("../models/User");


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
}).select("name location trust_score");

res.json(helpers);

} catch (error) {

res.status(500).json({ error: error.message });

}

};

const getNearbyHelpers = async (req,res)=>{

try{

const helpers = await User.find({
role:"helper",
availability_status:true
}).limit(20);

res.json(helpers);

}catch(err){

res.status(500).json({message:"Error loading helpers"});

}

};