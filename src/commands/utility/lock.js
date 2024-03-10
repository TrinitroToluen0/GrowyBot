const { Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors, ChannelType } = require("discord.js");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Disables @everyone to send messages in specific channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to lock").addChannelTypes(ChannelType.GuildText).setRequired(false)),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`🔒 This channel has been locked by the moderation team.`);
        await channel.send({ embeds: [embed] });
        embed.setDescription(`The channel <#${channel.id}> has been locked.`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
