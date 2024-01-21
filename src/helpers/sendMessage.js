const { TextChannel, PermissionsBitField } = require("discord.js");
const logger = require("../utils/logger");

async function sendMessage(channel, message) {
    try {
        if (!(channel instanceof TextChannel)) {
            throw new Error("The provided channel is not a valid instance of Channel.");
        }
        if (!message) {
            throw new Error("You cannot send an empty message.");
        }

        if (!channel.permissionsFor(channel.client.user).has(PermissionsBitField.Flags.SendMessages)) {
            const guildOwner = await channel.guild.fetchOwner();
            if (guildOwner) {
                await guildOwner.send(
                    `I tried to send a message on the channel \`${channel.name}\` of the guild \`${channel.guild.name}\` but I couldn't because i don't have permissions to send messages.`
                );
            }
            return false;
        }
        return await channel.send(message);
    } catch (error) {
        logger.warn(`No se pudo enviar un mensaje: ${error}`);
        return false;
    }
}

module.exports = sendMessage;
