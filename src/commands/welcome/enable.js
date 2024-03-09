const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "welcome",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("welcome-enable")
        .setDescription("Enables or disables the welcome messages module.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addBooleanOption((option) => option.setName("enabled").setDescription("Whether to enable or disable the welcome messages module").setRequired(true)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let enabled = interaction.options.getBoolean("enabled");

        // Check if the current state is the same as the one being applied
        if (guildConfig.welcomeEnabled === enabled) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The welcome messages module is already ${enabled ? "enabled" : "disabled"}.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'welcomeEnabled' field in the guild configuration
        guildConfig.welcomeEnabled = enabled;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The welcome messages module has been ${guildConfig.welcomeEnabled ? "enabled" : "disabled"}.`);
        await interaction.reply({ embeds: [embed] });
    },
};
