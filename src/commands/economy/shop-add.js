const Shop = require("../../models/ShopModel.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Colors, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [],
    data: new SlashCommandBuilder()
        .setName("shop-add")
        .setDescription("Adds an item to the guild shop")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        const embed = new EmbedBuilder().setColor(Colors.Red);

        if (!guildConfig.shopWebhook && !guildConfig.shopChannel) {
            embed.setDescription(
                "There is no webhook or channel set up to send store purchase notifications. You must set one of them with the commands </shop-setchannel:1215570013394833410> and </shop-setwebhook:1215793076409467002>"
            );
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const itemCount = await Shop.countDocuments({ guildId: interaction.guild.id });

        // Verifica si ya hay 10 artículos
        if (itemCount >= 10) {
            embed.setDescription("The shop is full. You can't add more items.");
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const modal = new ModalBuilder().setCustomId(interaction.id).setTitle("Add a new item");

        const nameInput = new TextInputBuilder().setLabel("Name").setCustomId("name").setStyle(TextInputStyle.Short).setMaxLength(30);
        const descInput = new TextInputBuilder().setLabel("Description").setCustomId("description").setStyle(TextInputStyle.Paragraph).setRequired(false);
        const priceInput = new TextInputBuilder().setLabel("Price").setCustomId("price").setStyle(TextInputStyle.Short);

        const row1 = new ActionRowBuilder().addComponents(nameInput);
        const row2 = new ActionRowBuilder().addComponents(descInput);
        const row3 = new ActionRowBuilder().addComponents(priceInput);
        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);

        try {
            const modalInteraction = await interaction.awaitModalSubmit({ time: 600_000 });

            const nameValue = modalInteraction.fields.getTextInputValue("name");
            const descValue = modalInteraction.fields.getTextInputValue("description");
            const priceValue = modalInteraction.fields.getTextInputValue("price");

            if (isNaN(priceValue)) {
                embed.setDescription("The price of the item must be a number.");
                modalInteraction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (priceValue < 0) {
                embed.setDescription("The price of the item must be higher than 0.");
                modalInteraction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            // Usa la cantidad de artículos en la tienda para determinar el número del nuevo artículo
            const shop = new Shop({ guildId: interaction.guild.id, name: nameValue, description: descValue, price: priceValue });
            await shop.save();
            embed.setColor(Colors.Green).setDescription("You successfully added a new item to the guild shop.");
            modalInteraction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {}
    },
};
