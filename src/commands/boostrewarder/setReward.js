const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin, nitro } = require("../../utils/emojis.json");

module.exports = {
    category: "boostrewarder",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("boostrewarder-setreward")
        .setDescription("Sets the reward amount for boosting the server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money to be granted for boosting the server").setRequired(true)),
    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        if (!guildConfig.boostRewarderEnabled) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("The boost rewarder module is disabled. Enable it with the command `/boostrewarder-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        let boostReward = interaction.options.getNumber("amount");
        guildConfig.boostReward = boostReward;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`${nitro} | The boost reward has ben set to ${goldCoin} \`${boostReward}\``);

        await interaction.reply({ embeds: [embed] });
    },
};
