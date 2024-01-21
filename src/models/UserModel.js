const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        inviterId: {
            type: String,
            required: false,
        },
        money: {
            type: Number,
            required: true,
            default: 0,
        },
        invitations: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema, "Users");
