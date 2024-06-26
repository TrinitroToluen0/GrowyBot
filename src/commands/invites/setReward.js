const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { invitation, goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "invites",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("invites-setreward")
        .setDescription("Sets the amount of money given for inviting users to the guild.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money to be granted for inviting a user").setRequired(true)),
    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let invitationReward = interaction.options.getNumber("amount");
        guildConfig.invitationReward = invitationReward;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`${invitation} | The invitation reward has ben set to ${goldCoin} \`${invitationReward}\``);

        await interaction.reply({ embeds: [embed] });
    },
};
