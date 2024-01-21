const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { embedSuccess } = require("../../utils/colors.js");
const { invitation, goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "invites",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("invite-setreward")
        .setDescription("Sets the reward amount for inviting users to the guild.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money to be granted for inviting a user").setRequired(true)),
    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let invitationReward = interaction.options.getNumber("amount");
        guildConfig.invitationReward = invitationReward;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`${invitation} | The invitation reward has ben set to ${goldCoin} \`${invitationReward}\``);

        await interaction.reply({ embeds: [embed] });
    },
};
