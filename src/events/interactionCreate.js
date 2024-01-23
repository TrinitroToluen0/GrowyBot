const { Events, Collection, EmbedBuilder, PermissionsBitField, Colors } = require("discord.js");
const logger = require("../utils/logger");
const checkBotPermissions = require("../helpers/checkBotPermissions.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Checkear permisos
        if (command.botPermissions && command.botPermissions.length > 0) {
            const missingPermissions = await checkBotPermissions(interaction.guild, command.botPermissions);
            const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

            if (missingPermissions !== true) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        `I can't run this command because I am missing some important permissions. I need the following permissions: ${missingPermissions.join(", ")}
                        
                        ${isAdmin ? "Go to `Server settings > Roles > Growy` and enable them." : ""}`
                    )
                    .setColor(Colors.Red);
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

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                return interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
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
            if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
            }
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    },
};
