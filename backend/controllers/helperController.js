const User = require("../models/User");

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