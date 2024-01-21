const { Events, ChannelType } = require("discord.js");
const logger = require("../utils/logger.js");

module.exports = {
    name: Events.ChannelDelete,
    async execute(client, channel) {
        try {
            if (channel.type !== ChannelType.GuildText) {
                return;
            }

            let guildConfig = await client.getGuildConfig(channel.guild.id);
            let updated = false;

            if (guildConfig.welcomeChannel === channel.id) {
                guildConfig.welcomeChannel = null;
                updated = true;
            }

            if (guildConfig.bumpReminderChannel === channel.id) {
                guildConfig.bumpReminderChannel = null;
                updated = true;
            }

            if (guildConfig.boostRewarderChannel === channel.id) {
                guildConfig.boostRewarderChannel = null;
                updated = true;
            }

            // Save the config in the database and the cache only if there was an update
            if (updated) {
                await guildConfig.save();
            }
        } catch (error) {
            logger.error("OnChannelDelete error: ", error);
        }
    },
};
