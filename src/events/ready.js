const { Events, version: discordVersion } = require("discord.js");
const { ACTIVITY_NAME, ACTIVITY_TYPE } = require("../config.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity(ACTIVITY_NAME, { type: ACTIVITY_TYPE });
        console.log(`
-------------------------------------------------------------
Nombre: ${client.user.tag}
Conectado en: ${client.guilds.cache.size} servidores y leyendo a ${client.users.cache.size} usuarios.
Versión de node.js: ${process.version}
Versión de discord.js: ${discordVersion}
-------------------------------------------------------------`);
    },
};
