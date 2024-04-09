const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("farewell-enable")
        .setDescription("Enables or disables the farewell messages module.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addBooleanOption((option) => option.setName("enabled").setDescription("Whether to enable or disable the farewell messages module").setRequired(true)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let enabled = interaction.options.getBoolean("enabled");

        if (guildConfig.farewellEnabled === enabled) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The farewell messages module is already ${enabled ? "enabled" : "disabled"}.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.farewellEnabled = enabled;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The farewell messages module has been ${guildConfig.farewellEnabled ? "enabled" : "disabled"}.`);
        await interaction.reply({ embeds: [embed] });
    },
};
