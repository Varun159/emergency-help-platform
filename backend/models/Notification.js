const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmergencyRequest"
    },

    helper_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    message: {
        type: String
    },

    is_read: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);