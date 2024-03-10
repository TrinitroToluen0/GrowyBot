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
const User = require("../../models/UserModel.js");
const logger = require("../../utils/logger.js");
const { goldCoin, shop } = require("../../utils/emojis.json");
const sendMessage = require("../../helpers/sendMessage.js");

module.exports = {
    category: "economy",
    cooldown: 5,
    botPermissions: [],
    data: new SlashCommandBuilder().setName("shop").setDescription("Shows items available for purchase in the shop.").setDMPermission(false),

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

        let purchasedItem;

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            const selectedValue = i.values[0];
            const item = await Shop.findOne({ guildId: i.guild.id, _id: selectedValue });
            purchasedItem = item;
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
            try {
                let user = await User.findOne({ guildId: i.guild.id, userId: i.user.id });
                if (!user) {
                    user = new User({
                        userId: i.user.id,
                        guildId: i.guild.id,
                    });
                }

                if (user.money < purchasedItem.price) {
                    const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("You don't have enough money to purchase this item.");
                    return i.followUp({ embeds: [embed] });
                }

                user.money -= purchasedItem.price;
                await user.save();

                if (guildConfig.shopChannel) {
                    const embed = new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setImage(i.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
                        .setTimestamp()
                        .setTitle(`${shop}  An user made a purchase`)
                        .setDescription(
                            `User: <@${i.user.id}> \nItem ID: \`${purchasedItem._id}\` \nItem name: \`${purchasedItem.name}\` \nItem price: ${goldCoin} \`${purchasedItem.price}\``
                        );
                    const channel = await client.channels.fetch(guildConfig.shopChannel);
                    sendMessage(channel, { embeds: [embed] });
                }
                if (guildConfig.shopWebhook) {
                    purchasedItem.buyerId = i.user.id;
                    fetch(guildConfig.shopWebhook, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(purchasedItem),
                    });
                }
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(
                        `You bought \`${purchasedItem.name}\` for a price of ${goldCoin} \`${purchasedItem.price}\`. A notification has been sent to the administrators of the guild about your purchase.`
                    );

                i.followUp({ embeds: [embed] });
            } catch (error) {
                logger.error(`An error occurred while sending a purchase notification: `, error);
            }
        });

        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
