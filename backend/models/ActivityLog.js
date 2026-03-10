const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
{
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    action: {
        type: String
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("ActivityLog", logSchema);