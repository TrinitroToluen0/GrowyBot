const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "boostrewarder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("boostrewarder-enable")
        .setDescription("Enables or disables the boost rewarder module.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addBooleanOption((option) => option.setName("enabled").setDescription("Whether to enable or disable the boost rewarder module").setRequired(true)),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let enabled = interaction.options.getBoolean("enabled");

        // Check if the current state is the same as the one being applied
        if (guildConfig.boostRewarderEnabled === enabled) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The boost rewarder module is already ${enabled ? "enabled" : "disabled"}.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'boostRewarderEnabled' field in the guild configuration
        guildConfig.boostRewarderEnabled = enabled;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`The boost rewarder module has been ${guildConfig.boostRewarderEnabled ? "enabled" : "disabled"}.`);
        await interaction.reply({ embeds: [embed] });
    },
};
