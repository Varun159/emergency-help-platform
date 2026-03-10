const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["requester", "helper", "admin"],
        default: "requester"
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    is_verified: {
        type: Boolean,
        default: false
    },

    trust_score: {
        type: Number,
        default: 0
    },

    availability_status: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);