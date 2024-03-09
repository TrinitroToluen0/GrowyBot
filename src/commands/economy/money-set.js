const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("money-set")
        .setDescription("Sets a user money balance.")
        .setDMPermission(false)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money you want to set.").setRequired(true))
        .addUserOption((option) => option.setName("user").setDescription("The user you want to set the money to."))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        let amount = interaction.options.getNumber("amount");
        let target = interaction.options.getUser("user");
        if (!target) target = interaction.user;

        let user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!user) {
            user = new User({
                userId: target.id,
                guildId: interaction.guild.id,
            });
        }

        user.money = amount;
        await user.save();
        const embed = new EmbedBuilder().setDescription(`You set the money balance of <@${target.id}> to ${goldCoin} \`${amount}\``).setColor(Colors.Green);
        interaction.reply({ embeds: [embed] });
    },
};
