const {
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
    Colors,
} = require("discord.js");
const Shop = require("../../models/ShopModel.js");
const logger = require("../../utils/logger.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [],
    data: new SlashCommandBuilder().setName("shop").setDescription("Shows available items from the shop").setDMPermission(false),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        if (!guildConfig.shopWebhook && !guildConfig.shopChannel) {
            embed.setDescription("The shop has not been setup yet by the guild administrators");
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        const items = await Shop.find({ guildId: interaction.guild.id });

        if (!items || items.length === 0) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("There are no items available in the shop.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("Select an item...")
            .setMaxValues(1)
            .addOptions(
                items.map((item) => {
                    const option = new StringSelectMenuOptionBuilder();
                    option.setLabel(item.name);
                    item.description ? option.setDescription(item.description.slice(0, 100)) : null;
                    option.setValue(item._id.toString());
                    return option;
                })
            );

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("Select an item to buy");
        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 600_000,
        });

        let selectedItem = null; // Variable para almacenar el artículo seleccionado

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            const selectedValue = i.values[0];
            const item = await Shop.findOne({ guildId: i.guild.id, _id: selectedValue });
            selectedItem = item; // Almacenamos el artículo seleccionado
            embed.setTitle(item.name);
            embed.setDescription(item.description);
            const button = new ButtonBuilder().setLabel(`Buy ($${item.price})`).setCustomId(i.id).setStyle(ButtonStyle.Success).setEmoji("💰");
            const row2 = new ActionRowBuilder().addComponents(button);
            reply.edit({ embeds: [embed], components: [row, row2] });
        });

        const buttonCollector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 600_000,
        });

        buttonCollector.on("collect", async (i) => {
            await i.deferUpdate();
            // if (guildConfig.shopChannel) {
            //     try {
            //         const notificationEmbed = new EmbedBuilder().setColor(Colors.Blue).setAuthor(i.user.id)
            //         const channel = client.channels.fetch(guildConfig.shopChannel);
            //         client.sendMessage(channel, {embeds: [notificationEmbed]})
            //     } catch {}
            // }
            if (guildConfig.shopWebhook) {
                try {
                    fetch(guildConfig.shopWebhook, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(selectedItem),
                    });
                } catch (error) {
                    logger.warn(`An error ocurred: ${error}`);
                }
            }

            console.log(`El artículo seleccionado es: ${selectedItem}`);
            i.followUp(`Has comprado el artículo: ${selectedItem.name}`);
        });

        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
