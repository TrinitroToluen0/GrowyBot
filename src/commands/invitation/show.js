const { EmbedBuilder } = require("discord.js");
const { embedInfo, embedError } = require("../../utils/colors.js");
const Server = require("../../models/ServerModel.js");

module.exports = async (interaction) => {
    const serverId = interaction.guild.id;
    let server = await Server.findOne({ serverId: serverId });

    if (!server) {
        server = new Server({ serverId: serverId });
    }

    const embed = new EmbedBuilder();

    if (!server.officialInvitation) {
        embed.setColor(embedError);
        embed.setDescription("The official server invitation has not been set yet. You can set it with the command `/invitation set`.");
    } else {
        embed.setColor(embedInfo);
        embed.setDescription(`The official server invitation is ${server.officialInvitation}`);
    }

    await interaction.reply({ embeds: [embed] });
};
