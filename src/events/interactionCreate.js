const { Events, Collection, EmbedBuilder, PermissionsBitField, Colors } = require("discord.js");
const logger = require("../utils/logger.js");
const checkBotPermissions = require("../helpers/checkBotPermissions.js");
const { DEV_USER_ID, SUPPORT_SERVER_INVITE } = require("../config.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (command.devOnly && interaction.user.id !== DEV_USER_ID) {
            logger.warn(`${interaction.user.id} (${interaction.user.username}) tried to execute a dev-only command.`);
            return;
        }

        // Checkear permisos
        if (command.botPermissions && command.botPermissions.length > 0) {
            const missingPermissions = await checkBotPermissions(interaction.guild, command.botPermissions);
            if (missingPermissions !== true) {
                const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
                let description = `I'm unable to execute this command because I lack the following permissions:\n\n ${missingPermissions.join(", ")}`;
                if (isAdmin) {
                    description += `\n\n Please go to \`Server settings > Roles > ${client.user.username}\` and grant me these permissions. If you don't find a \"${client.user.username}\" role, create one and assign it to me. Otherwise, this command won't work on your guild.`;
                }
                const embed = new EmbedBuilder().setDescription(description).setColor(Colors.Red);
                interaction.reply({ embeds: [embed], ephemeral: isAdmin });
                return;
            }
        }

        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime && interaction.user.id !== DEV_USER_ID) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                const embed = new EmbedBuilder()
                    .setDescription(`Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`)
                    .setColor(Colors.Blue);
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`There was an error while executing this command! \n\nIf this issue persists, please report it in our [Support server](${SUPPORT_SERVER_INVITE})`);
            if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
