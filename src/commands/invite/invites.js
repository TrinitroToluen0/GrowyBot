const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { embedInfo } = require("../../utils/colors.js");
const { invitation, invitation2, info } = require("../../utils/emojis.json");
const User = require("../../models/UserModel.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription("Shows the number of invites a user has.")
        .setDMPermission(false)
        .addUserOption((option) => option.setName("user").setDescription("The user to fetch")),
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
        const retentionRate = 100 - leftersPercentage;

        const embed = new EmbedBuilder()
            .setColor(embedInfo)
            .setDescription(
                `
                ${invitation} | Invitations: \`${user.invitations}\`
                ${invitation2} | Total Invited Users: \`${totalInvitedUsers}\`
                ${info} | Retention Rate: \`${retentionRate.toFixed(2)}%\`\n`
            )
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
