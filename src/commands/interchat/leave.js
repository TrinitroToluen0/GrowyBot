const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "interchat",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("interchat-leave")
        .setDescription("Leaves the current interchat server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        if (!guildConfig.interchatChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`There is no interchat server to leave.`);
            return await interaction.reply({ embeds: [embed] });
        }

        let reference = { ...guildConfig.interchatChannel };

        guildConfig.interchatChannel = null;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
                `You successfully left the server \`${reference.server}\` in the channel <#${reference.id}>. You will no longer receive messages from another guilds.`
            );
        await interaction.reply({ embeds: [embed] });
    },
};
