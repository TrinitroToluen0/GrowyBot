const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { embedInfo, embedError } = require("../../utils/colors.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("invite").setDescription("Show the official guild invitation.").setDMPermission(false),
    async execute(interaction) {
        let guild = await interaction.client.getGuildConfig(interaction.guild.id);

        const embed = new EmbedBuilder();
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!guild.invitationCode) {
            embed.setColor(embedError);
            embed.setDescription(`The official guild invitation has not been set yet.${isAdmin ? " You can set it with the command `/invitation set`." : ""}`);
        } else {
            embed.setColor(embedInfo);
            embed.setDescription(`The official guild invitation is https://discord.gg/${guild.invitationCode}`);
        }

        await interaction.reply({ embeds: [embed], ephemeral: isAdmin });
    },
};
