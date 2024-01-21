const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { embedInfo } = require("../../utils/colors.js");
const { invitation } = require("../../utils/emojis.json");

module.exports = {
    category: "invites",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("invite-leaderboard").setDescription("Shows the top 10 users with the most invitations on the guild.").setDMPermission(false),

    async execute(interaction) {
        const users = await User.find({ guildId: interaction.guild.id, invitations: { $gte: 1 } })
            .sort({ invitations: -1 })
            .limit(10);

        if (users.length <= 0) {
            const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The leaderboard is currently empty.`);
            return interaction.reply({ embeds: [embed] });
        }

        let top = [];
        for (let i = 0; i < users.length; i++) {
            top.push(`#${i + 1} | <@!${users[i].userId}> invitations: \`${users[i].invitations}\`\n`);
        }

        const embed = new EmbedBuilder()
            .setColor(embedInfo)
            .setDescription(`${invitation} | **TOP ${users.length} USERS WITH THE MOST INVITATIONS OF THE GUILD**\n\n ${top.join(" ")}\n`)
            .setTimestamp()
            .setFooter({ text: interaction.member.nickname || interaction.user.username, iconURL: interaction.user.avatarURL() });
        interaction.reply({ embeds: [embed] });
    },
};
