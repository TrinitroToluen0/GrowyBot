const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors } = require("discord.js");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setchannel")
        .setDescription("Sets a channel to remind your users to bump your server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the reminder messages.").addChannelTypes(ChannelType.GuildText)),

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

        if (channel.id === guildConfig.bumpReminderChannel) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The bump reminder channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.bumpReminderChannel = channel.id;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The bump reminder channel has been set to <#${guildConfig.bumpReminderChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
