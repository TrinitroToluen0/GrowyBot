const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { embedSuccess, embedInfo } = require("../../utils/colors.js");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-enable")
        .setDescription("Enables or disables the bump reminder module.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addBooleanOption((option) => option.setName("enabled").setDescription("Whether to enable or disable the bump reminder module").setRequired(true)),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let enabled = interaction.options.getBoolean("enabled");

        // Check if the current state is the same as the one being applied
        if (guildConfig.bumpReminderEnabled === enabled) {
            const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The bump reminder module is already ${enabled ? "enabled" : "disabled"}.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'bumpReminderEnabled' field in the guild configuration
        guildConfig.bumpReminderEnabled = enabled;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(embedSuccess)
            .setDescription(`The bump reminder module has been ${guildConfig.bumpReminderEnabled ? "enabled" : "disabled"}.`);
        await interaction.reply({ embeds: [embed] });
    },
};
