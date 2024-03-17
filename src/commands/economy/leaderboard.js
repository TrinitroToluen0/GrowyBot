const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("money-leaderboard").setDescription("Displays the top 10 users with the most money of the guild.").setDMPermission(false),

    async execute(interaction) {
        const users = await User.find({ guildId: interaction.guild.id }).sort({ money: -1 }).limit(10);

        if (users.length <= 0) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The leaderboard is currently empty.`);
            return interaction.reply({ embeds: [embed] });
        }

        let top = [];
        for (let i = 0; i < users.length; i++) {
            top.push(`**${i + 1}.** <@!${users[i].userId}> Money: \`${users[i].money}\`\n`);
        }

        // Buscar la posición del usuario en la lista completa de usuarios ordenados por dinero
        const allUsers = await User.find({ guildId: interaction.guild.id }).sort({ money: -1 });
        const userPosition = allUsers.findIndex((user) => user.userId === interaction.user.id) + 1;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setDescription(`${goldCoin} | **TOP ${users.length} USERS WITH THE MOST MONEY OF THE GUILD**\n\n ${top.join(" ")}\n`)
            .setTimestamp()
            .setFooter({ text: `Your position: ${userPosition}`, iconURL: interaction.user.avatarURL() });
        interaction.reply({ embeds: [embed] });
    },
};
