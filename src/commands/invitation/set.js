const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedSuccess, embedInfo } = require("../../utils/colors.js");
const Server = require("../../models/ServerModel.js");

module.exports = async (interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply("You are not allowed to use this command. ");
    }

    const serverId = interaction.guild.id;
    let server = await Server.findOne({ serverId: serverId });

    if (!server) {
        server = new Server({ serverId: serverId });
    }

    const invitationChannel = interaction.guild.channels.cache.get(server.invitationChannel);

    if (!invitationChannel) {
        const embed = new EmbedBuilder()
            .setColor(embedInfo)
            .setDescription("Before setting the invitation, you must set an invitations channel with the command `/invitation setchannel`.");
        return await interaction.reply({ embeds: [embed] });
    }

    const invite = await invitationChannel.createInvite({
        maxAge: 0,
        maxUses: 0,
    });

    server.officialInvitation = invite.url;
    await server.save();

    const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The official server invitation has ben set to ${invite.url}`);

    await interaction.reply({ embeds: [embed] });
};
