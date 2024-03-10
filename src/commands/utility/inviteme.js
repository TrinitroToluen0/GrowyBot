const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");
const { invitation } = require("../../utils/emojis.json");
const logger = require("../../utils/logger.js");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("inviteme").setDescription("Invite the Growy Bot to your Discord server.").setDMPermission(true),
    async execute(interaction) {
        logger.info(`User "${interaction.user.username}" used the command /inviteme`);
        const clientId = interaction.client.user.id;
        const permissions =
            PermissionsBitField.Flags.UseExternalEmojis |
            PermissionsBitField.Flags.ManageGuild |
            PermissionsBitField.Flags.CreateInstantInvite |
            PermissionsBitField.Flags.SendMessages |
            PermissionsBitField.Flags.ManageWebhooks |
            PermissionsBitField.Flags.ManageChannels |
            PermissionsBitField.Flags.MentionEveryone |
            PermissionsBitField.Flags.Administrator;
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`;

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`${invitation} | Click [here](${inviteLink}) to invite me to your guild!`);

        await interaction.reply({ embeds: [embed] });
    },
};
