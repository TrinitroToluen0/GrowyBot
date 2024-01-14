const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { embedInfo } = require("../../utils/colors.js");
const { invitation } = require("../../utils/emojis.json");

module.exports = {
    category: "utility",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("invite").setDescription("Generates an invite link for the bot.").setDMPermission(true),
    async execute(interaction) {
        const clientId = interaction.client.user.id;
        const permissions = PermissionsBitField.Flags.SendMessages | PermissionsBitField.Flags.ReadMessageHistory;
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`;

        const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`${invitation} | Click [here](${inviteLink}) to invite me to your server!`);

        await interaction.reply({ embeds: [embed] });
    },
};
