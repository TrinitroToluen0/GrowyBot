const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("money-remove")
        .setDescription("Takes money from a user.")
        .setDMPermission(false)
        .addNumberOption((option) => option.setName("amount").setDescription("The amount of money you want to take.").setRequired(true))
        .addUserOption((option) => option.setName("user").setDescription("The user you want to take money from"))
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

        user.money -= amount;
        await user.save();
        const embed = new EmbedBuilder().setDescription(`You toke ${goldCoin} \`${amount}\` from <@${target.id}>`).setColor(Colors.Green);
        interaction.reply({ embeds: [embed] });
    },
};
