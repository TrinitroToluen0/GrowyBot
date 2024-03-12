const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, version, Colors } = require("discord.js");
const emojis = require("../../utils/emojis.json");
const uptime = Math.floor(Date.now() / 1000 - process.uptime());

module.exports = {
    category: "dev-only",
    devOnly: true,
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Shows bot statistics and information.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const cpuUsage = process.cpuUsage();
        const cpuUsagePercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
            .addFields(
                { name: `${emojis.uptime} Uptime`, value: `<t:${uptime}:R>`, inline: false },
                { name: `${emojis.cpu} Uso de CPU`, value: "```" + `${cpuUsagePercent}%` + "```", inline: true },
                { name: `:books: Librería`, value: "```" + `Discord.JS ${version}` + "```", inline: true },
                { name: `${emojis.ping} Ping`, value: "```" + `${Math.round(interaction.client.ws.ping)}ms` + "```", inline: true },
                { name: `${emojis.ram} Uso de RAM`, value: "```" + `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB` + "```", inline: true },
                { name: `${emojis.node} Versión de Node.js`, value: "```" + process.version + "```", inline: true },
                { name: `${emojis.server} Servidores`, value: "```" + `${interaction.client.guilds.cache.size}` + "```", inline: true },
                { name: `${emojis.users} Miembros`, value: "```" + `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}` + "```", inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
