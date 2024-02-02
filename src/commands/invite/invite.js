const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, Colors } = require("discord.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.ManageGuild],
    data: new SlashCommandBuilder().setName("invite").setDescription("Show the official guild invitation.").setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply();
        const invites = await interaction.guild.invites.fetch();
        const botInvite = invites.find((invite) => invite.inviter.id === interaction.client.user.id);

        const embed = new EmbedBuilder();
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (botInvite) {
            embed.setColor(Colors.Blue);
            embed.setDescription(`The official guild invitation is ${botInvite.url}`);
        } else {
            embed.setColor(Colors.Red);
            embed.setDescription(`The official guild invitation has not been set yet.${isAdmin ? " You can set it with the command `/invite-set`." : ""}`);
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
