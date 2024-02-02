const { TextChannel } = require("discord.js");

async function sendMessage(channel, message) {
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
}

module.exports = sendMessage;
