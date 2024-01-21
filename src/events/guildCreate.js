const { Events } = require("discord.js");
const logger = require("../utils/logger.js");
const { green } = require("../utils/colors.js");

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild) {
        try {
            let guildConfig = await client.getGuildConfig(guild.id);
            if (guildConfig.botPresent === false) {
                guildConfig.botPresent = true;
                guildConfig.save();
            }
            logger.info(`${green}Bot was added to the guild "${guild.name}"`);
        } catch (error) {
            logger.error("OnGuildCreate error: ", error);
        }
    },
};
