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

        if (!guildConfig.interchatChannels || guildConfig.interchatChannels.length === 0) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`There is no interchat server to leave.`);
            return await interaction.reply({ embeds: [embed] });
        }

        const interchatChannel = guildConfig.interchatChannels.find((channel) => channel.id === interaction.channel.id);

        if (!interchatChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`The channel <#${interaction.channel.id}> is not an interchat channel.`);
            return await interaction.reply({ embeds: [embed] });
        }

        const serverName = interchatChannel.server;

        // Remove the interchat channel from the guildConfig
        guildConfig.interchatChannels = guildConfig.interchatChannels.filter((channel) => channel.id !== interaction.channel.id);
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
                `You successfully left the server \`${serverName}\` in the channel <#${interaction.channel.id}>. You will no longer receive messages from another guilds.`
            );
        await interaction.reply({ embeds: [embed] });
    },
};
