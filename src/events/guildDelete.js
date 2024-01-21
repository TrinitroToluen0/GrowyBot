const { Events } = require("discord.js");
const logger = require("../utils/logger.js");

module.exports = {
    name: Events.GuildDelete,
    async execute(client, guild) {
        try {
            let guildConfig = await client.getGuildConfig(guild.id);
            guildConfig.botPresent = false;
            await guildConfig.save();
            client.guildConfigs.delete(guild.id);
            logger.info(`Bot was kicked from the guild "${guild.name}"`);
        } catch (error) {
            logger.error("OnGuildDelete error: ", error);
        }
    },
};
