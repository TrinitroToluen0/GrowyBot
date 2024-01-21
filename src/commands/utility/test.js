const { rewardBoosters } = require("../../daily.js");
const sendMessage = require("../../helpers/sendMessage.js");
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "test",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("test").setDescription("test").setDMPermission(false).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        rewardBoosters(interaction.client);
        interaction.reply("Done!");
    },
};
