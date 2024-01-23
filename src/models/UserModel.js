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

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema, "Users");
