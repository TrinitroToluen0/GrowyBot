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
const logger = require("../../utils/logger.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [],
    data: new SlashCommandBuilder()
        .setName("shop-remove")
        .setDescription("Removes an item of the guild shop")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const options = await Shop.find({ guildId: interaction.guild.id });

        if (!options || options.length === 0) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("There are no items to remove.");
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

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("Select an item to remove");
        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 600_000,
        });

        collector.on("collect", async (i) => {
            const selectedValue = i.values[0];
            await Shop.deleteOne({ guildId: i.guild.id, _id: selectedValue });
            const successEmbed = new EmbedBuilder().setColor(Colors.Green).setDescription("You successfully removed an item of the guild shop.");
            i.reply({ embeds: [successEmbed], ephemeral: true });
            collector.stop();
        });

        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
