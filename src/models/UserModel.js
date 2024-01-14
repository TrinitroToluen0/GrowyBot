const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        serverId: {
            type: String,
            required: true,
        },
        invitationLink: String,
        money: {
            type: String,
            required: true,
            default: 0,
        },
        invitations: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema, "Users");
