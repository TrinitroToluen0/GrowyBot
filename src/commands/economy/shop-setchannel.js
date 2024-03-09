const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors } = require("discord.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("shop-setchannel")
        .setDescription("Sets a channel to send a notification when a user buys an item of the shop.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the shop notifications.").addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!client.canSendMessages(channel)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`Make sure I have permissions to view and send messages to <#${channel.id}>.`);
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.shopChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The shop notifications channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.shopChannel = channel.id;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The shop notifications channel has ben set to <#${guildConfig.shopChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
