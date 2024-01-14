const { EmbedBuilder, PermissionsBitField } = require("discord.js");
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

    server.invitationChannel = "";
    await server.save();

    const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The invitations channel has been unset and no more welcome messages will be sent in it.`);
    await interaction.reply({ embeds: [embed] });
};
