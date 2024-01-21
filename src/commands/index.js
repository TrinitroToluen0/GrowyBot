const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { CLIENT_ID, BOT_TOKEN } = require("../config.js");
const logger = require("../utils/logger.js");

module.exports = async (client) => {
    const commands = [];
    const foldersPath = path.join(__dirname);
    const commandFolders = fs.readdirSync(foldersPath).filter((folder) => fs.statSync(path.join(foldersPath, folder)).isDirectory());

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                logger.warn(`Command "${command.data.name}" is missing required "data" or "execute" property. Skipping command.`);
            }
        }
    }

    const rest = new REST().setToken(BOT_TOKEN);

    try {
        logger.info(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        logger.error(error);
    }
};
