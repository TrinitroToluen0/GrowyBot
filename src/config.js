const dotenv = require("dotenv");
dotenv.config();
const { ActivityType } = require("discord.js");

module.exports = {
    DEV_MODE: process.env.NODE_ENV !== "production",
    ACTIVITY_NAME: "The 100",
    ACTIVITY_TYPE: ActivityType.Watching,
    MONGODB_URI: process.env.MONGODB_URI,
    CLIENT_ID: process.env.CLIENT_ID,
    BOT_TOKEN: process.env.BOT_TOKEN,
    DEV_USER_ID: "528408424728363029",
    DEV_GUILDS_ID: ["903180945765564438"],
    INTERCHAT_MOD_TEAM: ["528408424728363029", "1009711006429216788", "665066080909393921", "1015430766295011378"],
    SUPPORT_SERVER_INVITE: "https://discord.gg/yJbFXmxQKC",
};
