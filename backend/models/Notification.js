const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmergencyRequest"
    },

    helper_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["request_accepted", "new_emergency", "request_completed", "general"],
        default: "general"
    },

    is_read: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);