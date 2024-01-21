const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { embedInfo } = require("../../utils/colors.js");
const logger = require("../../utils/logger.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "economy",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("money-leaderboard").setDescription("Displays the top 10 users with the most money on the guild.").setDMPermission(false),

    async execute(interaction) {
        try {
            const users = await User.find({ guildId: interaction.guild.id, money: { $gte: 1 } })
                .sort({ money: -1 })
                .limit(10);

            if (users.length <= 0) {
                const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The leaderboard is currently empty.`);
                return interaction.reply({ embeds: [embed] });
            }

            let top = [];
            for (let i = 0; i < users.length; i++) {
                top.push(`#${i + 1} | <@!${users[i].userId}> Money: \`${users[i].money}\`\n`);
            }

            const embed = new EmbedBuilder()
                .setColor(embedInfo)
                .setDescription(`${goldCoin} | **TOP ${users.length} USERS WITH THE MOST MONEY OF THE GUILD**\n\n ${top.join(" ")}\n`)
                .setTimestamp()
                .setFooter({ text: interaction.member.nickname || interaction.user.username, iconURL: interaction.user.avatarURL() });
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            logger.error(err);
        }
    },
};
