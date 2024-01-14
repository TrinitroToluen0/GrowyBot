const dotenv = require("dotenv");
dotenv.config();
const { ActivityType } = require("discord.js");

module.exports = {
    DEV_MODE: true,
    MONGODB_URI: process.env.MONGODB_URI,
    BOT_TOKEN: process.env.BOT_TOKEN,
    CLIENT_ID: "1195233538115637308",
    ACTIVITY_NAME: "The 100",
    ACTIVITY_TYPE: ActivityType.Watching,
};
