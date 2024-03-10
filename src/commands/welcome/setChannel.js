const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors } = require("discord.js");

module.exports = {
    category: "welcome",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("welcome-setchannel")
        .setDescription("Sets a channel to display the welcome messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the welcome messages.").addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!guildConfig.welcomeEnabled) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("The welcome messages module is disabled. Enable it with the command `/welcome-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        if (!client.canSendMessages(channel)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`Make sure I have permissions to view and send messages to <#${channel.id}>.`);
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.welcomeChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The welcome messages channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.welcomeChannel = channel.id;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The welcome messages channel has ben set to <#${guildConfig.welcomeChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
