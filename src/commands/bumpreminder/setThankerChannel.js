const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors } = require("discord.js");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setthankschannel")
        .setDescription("Sets a channel to thank the users who bumped your server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription(`The channel where the bump thanks messages will be sent.`).addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!guildConfig.bumpReminderEnabled) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription("The bump reminder module is disabled. Enable it with the command </bumpreminder-enable:1201445092129517611>");
            return interaction.reply({ embeds: [embed] });
        }

        if (!client.canSendMessages(channel)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`Make sure I have permissions to view and send messages to <#${channel.id}>.`);
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.bumpThanksChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The bump thanks channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.bumpThanksChannel = channel.id;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The bump thanks channel has been set to <#${guildConfig.bumpThanksChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
