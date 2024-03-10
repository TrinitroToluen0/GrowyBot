const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete messages from a channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addIntegerOption((option) => option.setName("amount").setDescription("Number of messages to delete").setRequired(true).setMinValue(1).setMaxValue(99))
        .addUserOption((option) => option.setName("user").setDescription("If specified, the command will only delete messages from this user").setRequired(false)),

    async execute(interaction) {
        const amount = interaction.options.getInteger("amount");
        const user = interaction.options.getUser("user");

        const messages = await interaction.channel.messages.fetch();

        if (user) {
            let i = 0;
            let messagesToDelete = [];
            messages.filter((message) => {
                if (message.author.id === user.id && amount > i) {
                    messagesToDelete.push(message);
                    i++;
                }
            });
            deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`I have deleted ${deletedMessages.size} messages from <@${user.id}>`);
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            deletedMessages = await interaction.channel.bulkDelete(amount, true);
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`I have deleted ${deletedMessages.size} messages.`);
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
