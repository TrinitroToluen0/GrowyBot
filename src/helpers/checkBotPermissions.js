const { Guild, PermissionsBitField, TextChannel } = require("discord.js");
const logger = require("../utils/logger");

async function checkBotPermissions(guild, requiredPermissions) {
    if (!(guild instanceof Guild)) {
        throw new Error("The provided guild is not a valid instance of Guild.");
    }

    if (!Array.isArray(requiredPermissions)) {
        requiredPermissions = [requiredPermissions];
    }

    const botMember = await guild.members.fetch(guild.client.user);

    const missingPermissions = requiredPermissions.filter((permission) => !botMember.permissions.has(permission));

    if (missingPermissions.length > 0) {
        // Convertir los valores de bit de los permisos a sus nombres correspondientes
        const missingPermissionsNames = missingPermissions.map((permission) => {
            const permissions = new PermissionsBitField(permission);
            return `\`${permissions.toArray().join(", ")}\``;
        });
        return missingPermissionsNames;
    }

    return true;
}

global.client.canSendMessages = (channel) => {
    try {
        if (!(channel instanceof TextChannel)) {
            throw new Error("The provided channel is not a valid instance of TextChannel.");
        }

        const botPermissions = channel.permissionsFor(channel.client.user);
        logger.debug(channel.client.user);
        logger.debug(channel.permissionsFor(channel.client.user));

        if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
            return false;
        }

        if (!botPermissions.has(PermissionsBitField.Flags.SendMessages)) {
            return false;
        }

        return true;
    } catch (error) {
        logger.error("canSendMessages failed: ", error);
        return false;
    }
};

module.exports = checkBotPermissions;
