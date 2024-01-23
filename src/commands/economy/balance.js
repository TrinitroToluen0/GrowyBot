const User = require("../../models/UserModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");
const { goldCoin } = require("../../utils/emojis.json");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Checks a user’s money balance.")
        .setDMPermission(false)
        .addUserOption((option) => option.setName("user").setDescription("The user you want to check their balance.")),

    async execute(interaction) {
        let target = interaction.options.getUser("user");
        if (!target) target = interaction.user;

        let user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!user) {
            user = new User({
                userId: target.id,
                guildId: interaction.guild.id,
            });
            await user.save();
        }
        const embed = new EmbedBuilder().setDescription(`The money balance of <@${target.id}> is ${goldCoin} \`${user.money}\``).setColor(Colors.Blue);
        interaction.reply({ embeds: [embed] });
    },
};
