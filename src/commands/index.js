const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { CLIENT_ID, BOT_TOKEN, DEV_GUILDS_ID } = require("../config.js");
const logger = require("../utils/logger.js");

module.exports = async (client) => {
    const foldersPath = path.join(__dirname);
    const commandFolders = fs.readdirSync(foldersPath).filter((folder) => fs.statSync(path.join(foldersPath, folder)).isDirectory());
    const { commands } = client;

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                commands.set(command.data.name, command);
            } else {
                logger.warn(`Command "${command.data.name}" is missing required "data" or "execute" property. Skipping command.`);
            }
        }
    }

    const rest = new REST().setToken(BOT_TOKEN);

    try {
        const globalCommands = commands.filter((command) => command.devOnly != true).map((command) => command.data.toJSON());
        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: globalCommands });
        const devOnlyCommands = commands.filter((command) => command.devOnly === true).map((command) => command.data.toJSON());
        for (const GUILD_ID of DEV_GUILDS_ID) {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: devOnlyCommands });
        }
        logger.info(`Successfully reloaded ${data.length} global commands and ${devOnlyCommands.length} dev-only commands.`);
    } catch (error) {
        logger.error("deployCommands failed: ", error);
    }
};
