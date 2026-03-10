const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
{
    requester_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    accepted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    urgency_level: {
        type: String,
        enum: ["low", "medium", "high"]
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number]
        }
    },

    status: {
        type: String,
        enum: ["open", "accepted", "in-progress", "resolved", "cancelled"],
        default: "open"
    }

},
{ timestamps: true }
);

emergencySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("EmergencyRequest", emergencySchema);