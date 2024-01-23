const { Events, version: discordVersion, PermissionsBitField } = require("discord.js");
const { ACTIVITY_NAME, ACTIVITY_TYPE } = require("../config.js");
const logger = require("../utils/logger.js");
const Guild = require("../models/GuildModel.js");
const checkBotPermissions = require("../helpers/checkBotPermissions.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        cacheGuilds(client);
        cacheInvites(client);
        printReady(client);
        client.user.setActivity(ACTIVITY_NAME, { type: ACTIVITY_TYPE });
    },
};

const cacheGuilds = async (client) => {
    const guildConfigs = await Guild.find({ botPresent: true });
    guildConfigs.forEach((config) => {
        client.guildConfigs.set(config.guildId, config);
    });
};

const cacheInvites = async (client) => {
    for (const guild of client.guilds.cache.values()) {
        try {
            if (checkBotPermissions(guild, PermissionsBitField.Flags.ManageGuild) !== true) continue;
            const invites = await guild.invites.fetch();
            const codeUses = new Map();
            invites.each((inv) => codeUses.set(inv.code, inv.uses));
            client.invites.set(guild.id, codeUses);
        } catch (error) {
            logger.error("cacheInvites failed:", error);
        }
    }
};

const printReady = (client) => {
    console.log(`
-------------------------------------------------------------
Nombre: ${client.user.tag}
Conectado en: ${client.guilds.cache.size} servidores y leyendo a ${client.users.cache.size} usuarios.
Versión de node.js: ${process.version}
Versión de discord.js: ${discordVersion}
-------------------------------------------------------------`);
};
