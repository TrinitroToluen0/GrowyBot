const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    Colors,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
} = require("discord.js");
const Shop = require("../../models/ShopModel.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [],
    data: new SlashCommandBuilder()
        .setName("shop-edit")
        .setDescription("Edits an item of the guild shop")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const options = await Shop.find({ guildId: interaction.guild.id });

        if (!options || options.length === 0) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("There are no items to edit.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("Select an item...")
            .setMaxValues(1)
            .addOptions(
                options.map((option) => {
                    const select = new StringSelectMenuOptionBuilder();
                    select.setLabel(option.name);
                    option.description ? select.setDescription(option.description.slice(0, 100)) : null;
                    select.setValue(option._id.toString());
                    return select;
                })
            );

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("Select an item to edit");
        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 600_000,
        });

        collector.on("collect", async (i) => {
            const selectedValue = i.values[0];
            const selectedOption = await Shop.findOne({ guildId: i.guild.id, _id: selectedValue });
            if (selectedOption) {
                const modal = new ModalBuilder().setCustomId(selectedOption._id.toString()).setTitle("Edit an existing item");

                const nameInput = new TextInputBuilder().setLabel("Name").setCustomId("name").setStyle(TextInputStyle.Short).setMaxLength(30).setValue(selectedOption.name);
                const descInput = new TextInputBuilder()
                    .setLabel("Description")
                    .setCustomId("description")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setValue(selectedOption.description);
                const priceInput = new TextInputBuilder().setLabel("Price").setCustomId("price").setStyle(TextInputStyle.Short).setValue(selectedOption.price.toString());

                const row1 = new ActionRowBuilder().addComponents(nameInput);
                const row2 = new ActionRowBuilder().addComponents(descInput);
                const row3 = new ActionRowBuilder().addComponents(priceInput);
                modal.addComponents(row1, row2, row3);

                await i.showModal(modal);

                try {
                    const modalInteraction = await i.awaitModalSubmit({ time: 600_000 });
                    const nameValue = modalInteraction.fields.getTextInputValue("name");
                    const descValue = modalInteraction.fields.getTextInputValue("description");
                    const priceValue = modalInteraction.fields.getTextInputValue("price");

                    const embed = new EmbedBuilder().setColor(Colors.Red);

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

                    selectedOption.name = nameValue;
                    selectedOption.description = descValue;
                    selectedOption.price = priceValue;
                    await selectedOption.save();

                    embed.setColor(Colors.Green).setDescription("You successfully edited an item of the guild shop.");
                    modalInteraction.reply({ embeds: [embed], ephemeral: true });
                    collector.stop();
                } catch (error) {}
            }
        });

        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
