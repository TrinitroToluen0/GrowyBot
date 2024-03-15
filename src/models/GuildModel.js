const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true,
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
        invitationReward: {
            type: Number,
            required: true,
            default: 20,
            min: 0,
        },
        bumpReminderEnabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        bumpReminderRole: String,
        bumpReminderChannel: String,
        nextBumpReminder: Date,
        bumpReward: {
            type: Number,
            required: true,
            default: 5,
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
            default: 5,
            min: 0,
        },
        interchatChannels: [
            {
                id: String,
                server: {
                    type: String,
                },
            },
        ],
        shopChannel: String,
        shopWebhook: String,
    },
    { versionKey: false }
);

guildSchema.post("save", (doc) => {
    global.client.guildConfigs.set(doc.guildId, doc);
});

module.exports = mongoose.model("Guild", guildSchema, "Guilds");
