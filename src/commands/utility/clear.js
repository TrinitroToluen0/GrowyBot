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

        let messagesToDelete = [];
        if (user) {
            let i = 0;
            messages.filter((message) => {
                if (message.author.id === user.id && amount > i) {
                    messagesToDelete.push(message);
                    i++;
                }
            });
        } else {
            messagesToDelete = messages.array().slice(0, amount);
        }

        const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);
        const embed = new EmbedBuilder().setColor(Colors.Blue);

        if (deletedMessages.size === 0) {
            embed.setDescription(`"I didn't delete any messages. Make sure the messages you tried to delete are not more than 2 weeks old.`);
        } else {
            const message = user ? `I have deleted ${deletedMessages.size} messages from <@${user.id}>` : `I have deleted ${deletedMessages.size} messages.`;
            embed.setDescription(message);
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
