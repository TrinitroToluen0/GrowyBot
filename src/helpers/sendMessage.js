const { TextChannel } = require("discord.js");
const logger = require("../utils/logger");

async function sendMessage(channel, message) {
    try {
        if (!(channel instanceof TextChannel)) {
            throw new Error("The provided channel is not a valid instance of Channel.");
        }
        if (!message) {
            throw new Error("You cannot send an empty message.");
        }

        if (!channel.client.canSendMessages(channel)) {
            return false;
        }

        return await channel.send(message);
    } catch (error) {
        logger.warn("sendMessage failed: ", error);
        return false;
    }
}

module.exports = sendMessage;
