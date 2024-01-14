const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, version } = require("discord.js");
const { embedInfo } = require("../../utils/colors.js");
const emojis = require("../../utils/emojis.json");

const uptime = Math.floor(Date.now() / 1000 - process.uptime());

module.exports = {
    category: "utility",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("botinfo").setDescription("Displays bot information.").setDMPermission(false),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply("You are not allowed to use this command.");
        }

        const cpuUsage = process.cpuUsage();
        const cpuUsagePercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor(embedInfo)
            .setTitle("Bot Information")
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
            .addFields(
                { name: `${emojis.uptime} Uptime`, value: `<t:${uptime}:R>`, inline: false },
                { name: `${emojis.cpu} CPU Usage`, value: "```" + `${cpuUsagePercent}%` + "```", inline: true },
                { name: `:books: Librería`, value: "```" + `Discord.JS ${version}` + "```", inline: true },
                { name: `${emojis.ping} Ping`, value: "```" + `${Math.round(interaction.client.ws.ping)}ms` + "```", inline: true },
                { name: `${emojis.ram} Uso de RAM`, value: "```" + `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB` + "```", inline: true },
                { name: `${emojis.node} Versión de Node.js`, value: "```" + process.version + "```", inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
