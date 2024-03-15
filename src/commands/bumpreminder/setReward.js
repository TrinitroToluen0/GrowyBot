const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setreward")
        .setDescription("Sets the reward amount for bumping the server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money to be granted for bumping the server").setRequired(true)),
    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        if (!guildConfig.bumpReminderEnabled) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription("The bump reminder module is disabled. Enable it with the command </bumpreminder-enable:1201445092129517611>");
            return interaction.reply({ embeds: [embed] });
        }

        let bumpReward = interaction.options.getNumber("amount");
        guildConfig.bumpReward = bumpReward;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The bump reward has ben set to ${goldCoin} \`${bumpReward}\``);
        await interaction.reply({ embeds: [embed] });
    },
};
