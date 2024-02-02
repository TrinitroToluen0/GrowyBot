const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "moderation",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete a channel's messages")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addIntegerOption((option) => option.setName("amount").setDescription("Number of messages to delete").setRequired(true))
        .addUserOption((option) => option.setName("member").setDescription("If specified, the command will only delete messages from this member").setRequired(false)),

    async execute(interaction) {
        const { options, channel } = interaction;
    },
};
