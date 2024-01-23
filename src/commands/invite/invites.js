const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionsBitField } = require("discord.js");
const { invitation, invitation2, percentage, info } = require("../../utils/emojis.json");
const User = require("../../models/UserModel.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription("Shows the number of invites a user has.")
        .setDMPermission(false)
        .addUserOption((option) => option.setName("user").setDescription("The user to get their number of invitations")),
    async execute(interaction) {
        let target = interaction.options.getUser("user");

        if (!target) target = interaction.user;

        let user = await User.findOne({ guildId: interaction.guild.id, userId: target.id });

        if (!user) {
            user = new User({
                userId: target.id,
                guildId: interaction.guild.id,
            });
            await user.save();
        }

        const totalInvitedUsers = await User.find({ guildId: interaction.guild.id, inviterId: target.id }).countDocuments();
        const leftersPercentage = totalInvitedUsers === 0 ? 0 : ((totalInvitedUsers - user.invitations) / totalInvitedUsers) * 100;
        let retentionRate = 100 - leftersPercentage;
        if (user.invitations === 0 && totalInvitedUsers === 0) {
            retentionRate = 0;
        }

        let description = `
        ${invitation} | Invitations: \`${user.invitations}\`
        ${invitation2} | Total Invited Users: \`${totalInvitedUsers}\`
        ${percentage} | Retention Rate: \`${retentionRate.toFixed(2)}%\`
        `;

        if (user.inviterId) {
            description += `\nInvited by: <@${user.inviterId}>`;
        }

        const embed = new EmbedBuilder();
        embed.setColor(Colors.Blue);
        embed.setAuthor({ name: target.tag, iconURL: target.avatarURL(), url: `https://discord.com/users/${target.id}` });
        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    },
};
