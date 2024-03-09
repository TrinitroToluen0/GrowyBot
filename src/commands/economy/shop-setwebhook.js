const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("shop-setwebhook")
        .setDescription("Sets a webhook to send a POST request with a JSON every time an item is purchased from the shop.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) => option.setName("webhook-url").setDescription("The webhook URL.").setRequired(true)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        const webhookURL = interaction.options.getString("wehbook-url");

        // Validar si webhookURL es una URL válida
        const urlRegex = /^(https?:\/\/)?(((a-z\d*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
        const isValidUrl = urlRegex.test(webhookURL);
        if (!isValidUrl) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`The provided string is not a valid URL.`);
            return await interaction.reply({ embeds: [embed] });
        }

        if (webhookURL === guildConfig.shopWebhook) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The webhook URL is already ${webhookURL}`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.shopWebhook = webhookURL;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The webhook URL has been set to ${guildConfig.shopWebhook}`);
        await interaction.reply({ embeds: [embed] });
    },
};
