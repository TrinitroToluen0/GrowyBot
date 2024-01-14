const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const { embedSuccess, embedError } = require("../../utils/colors.js");
const Server = require("../../models/ServerModel.js");

module.exports = async (interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder().setColor(embedError).setDescription("You are not allowed to use this command.");
        return interaction.reply({ embeds: [embed] });
    }

    const serverId = interaction.guild.id;
    let server = await Server.findOne({ serverId: serverId });

    if (!server) {
        server = new Server({ serverId: serverId });
    }

    let channel = interaction.options.getChannel("channel");

    if (channel && channel.type !== ChannelType.GuildText) {
        const embed = new EmbedBuilder().setColor(embedError).setDescription("The channel must be a valid text channel.");
        return interaction.reply({ embeds: [embed] });
    }

    if (!channel) {
        channel = interaction.channel;
    }

    server.invitationChannel = channel.id;
    await server.save();

    const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The invitations channel has been set to <#${channel.id}>`);
    await interaction.reply({ embeds: [embed] });
};
