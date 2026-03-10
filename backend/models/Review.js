const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmergencyRequest"
    },

    reviewer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    helper_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    comment: {
        type: String
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);