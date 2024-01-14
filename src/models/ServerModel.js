const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema(
    {
        serverId: {
            type: String,
            required: true,
        },
        officialInvitation: String,
        invitationChannel: String,
        invitationReward: {
            type: Number,
            required: true,
            default: 0,
        },
        bumpReminderChannel: String,
        bumpReward: {
            type: Number,
            required: true,
            default: 0,
        },
        boostRewarderChannel: String,
        boostReward: {
            type: Number,
            required: true,
            default: 0,
        },
        interchatChannels: [String],
    },
    { versionKey: false }
);

module.exports = mongoose.model("Server", serverSchema, "Servers");
