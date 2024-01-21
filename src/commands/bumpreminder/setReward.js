const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { embedSuccess } = require("../../utils/colors.js");
const { nitro, goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setreward")
        .setDescription("Sets the reward amount for bumping the server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money to be granted for bumping the server").setRequired(true)),
    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        if (!guildConfig.bumpReminderEnabled) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The bump reminder module is disabled. Enable it with the command `/bumpreminder-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        let bumpReward = interaction.options.getNumber("amount");
        guildConfig.bumpReward = bumpReward;
        await guildConfig.save();
        interaction.client.guildConfigConfigs.set(interaction.guild.id, guildConfig);

        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The bump reward has ben set to ${goldCoin} \`${bumpReward}\``);

        await interaction.reply({ embeds: [embed] });
    },
};
