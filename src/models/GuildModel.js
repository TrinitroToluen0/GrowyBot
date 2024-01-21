const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
        },
        botPresent: {
            type: Boolean,
            required: true,
            default: true,
        },
        welcomeChannel: String,
        welcomeEnabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        invitationCode: String,
        invitationReward: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        bumpReminderEnabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        bumpReminderChannel: String,
        bumpReward: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        boostRewarderEnabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        boostRewarderChannel: String,
        boostReward: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        interchatChannels: [String],
    },
    { versionKey: false }
);

guildSchema.post("save", (doc) => {
    global.client.guildConfigs.set(doc.guildId, doc);
});

module.exports = mongoose.model("Guild", guildSchema, "Guilds");
