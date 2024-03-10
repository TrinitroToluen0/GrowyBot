const { Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors, ChannelType } = require("discord.js");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Allows @everyone to send messages in specific channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to unlock").addChannelTypes(ChannelType.GuildText).setRequired(false)),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`🔓 This channel has been unlocked by the moderation team.`);
        await channel.send({ embeds: [embed] });
        embed.setDescription(`The channel <#${channel.id}> has been unlocked.`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
