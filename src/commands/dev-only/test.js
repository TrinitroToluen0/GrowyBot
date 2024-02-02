const checkBotPermissions = require("../../helpers/checkBotPermissions.js");
const rewardBoosters = require("../../helpers/rewardBoosters.js");
const sendMessage = require("../../helpers/sendMessage.js");
const { faker } = require("@faker-js/faker");
const User = require("../../models/UserModel.js");
const logger = require("../../utils/logger.js");
const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, quote } = require("discord.js");
const sendToInterchat = require("../../helpers/interchat.js");
const emojis = require("../../utils/emojis.json");
const { onBump } = require("../../helpers/bumpReminder.js");

module.exports = {
    category: "dev-only",
    cooldown: 5,
    devOnly: true,
    data: new SlashCommandBuilder().setName("bump").setDescription("test").setDMPermission(false).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        await interaction.deferReply();
        onBump(interaction.user, interaction.guild);
        const embed = new EmbedBuilder()
            .setTitle("DISBOARD: The Public Server List")
            .setDescription("Bump done! :thumbsup:\n" + "Check it out [on DISBOARD](https://disboard.org/server/747876685302595647).")
            .setColor(2406327)
            .setURL("https://disboard.org/")
            .setImage("https://disboard.org/images/bot-command-image-bump.png");
        interaction.editReply({ embeds: [embed] });
    },
};
