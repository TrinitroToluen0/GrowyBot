const { Events } = require("discord.js");
const sendToInterchat = require("../helpers/interchat.js");
const CustomEvents = require("../helpers/customEvents.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if (message.interaction?.commandName === "bump" && message.author.id === "302050872383242240" && message.embeds[0]?.data.description.includes("Bump done")) {
            interaction.client.emit(CustomEvents.Bump, message.interaction.user, message.guild);
        }

        if (message.author.bot) return;

        const guildConfig = await client.getGuildConfig(message.guild.id);
        if (message.channel.id === guildConfig.interchatChannel.id) {
            sendToInterchat(message, guildConfig.interchatChannel.server);
        }
    },
};