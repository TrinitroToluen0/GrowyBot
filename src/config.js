const dotenv = require("dotenv");
dotenv.config();
const { ActivityType } = require("discord.js");

module.exports = {
    DEV_MODE: true,
    DEV_GUILDS_ID: ["903180945765564438", "747876685302595647"],
    DEV_USER_ID: "528408424728363029",
    MONGODB_URI: process.env.MONGODB_URI,
    BOT_TOKEN: process.env.BOT_TOKEN,
    CLIENT_ID: "1195233538115637308",
    ACTIVITY_NAME: "The 100",
    ACTIVITY_TYPE: ActivityType.Watching,
    INTERCHAT_MOD_TEAM: ["528408424728363029"],
};
