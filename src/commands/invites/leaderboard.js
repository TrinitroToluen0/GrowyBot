const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { invitation } = require("../../utils/emojis.json");

module.exports = {
    category: "invites",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("invites-leaderboard").setDescription("Displays the top 10 users with the most invites of the guild.").setDMPermission(false),

    async execute(interaction) {
        const users = await User.find({ guildId: interaction.guild.id, invitations: { $gte: 1 } })
            .sort({ invitations: -1 })
            .limit(10);

        if (users.length <= 0) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The leaderboard is currently empty.`);
            return interaction.reply({ embeds: [embed] });
        }

        let top = [];
        for (let i = 0; i < users.length; i++) {
            top.push(`#${i + 1} | <@!${users[i].userId}> Invites: \`${users[i].money}\`\n`);
        }

        const allUsers = await User.find({ guildId: interaction.guild.id }).sort({ invitations: -1 });
        const userPosition = allUsers.findIndex((user) => user.userId === interaction.user.id) + 1;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setDescription(`${invitation} | **TOP ${users.length} USERS WITH THE MOST INVITES OF THE GUILD**\n\n ${top.join(" ")}\n`)
            .setTimestamp()
            .setFooter({ text: `Your position: ${userPosition}`, iconURL: interaction.user.avatarURL() });
        interaction.reply({ embeds: [embed] });
    },
};
