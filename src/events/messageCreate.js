const { Events, ChannelType } = require("discord.js");
const emojis = require("../utils/emojis.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if (message.channel.type === ChannelType.DM && !message.author.bot) {
            message.channel.send(`${emojis.invitation} HOLAAAAAAAAAAAAAAAAAAAAAAA`);
        }
    },
};
