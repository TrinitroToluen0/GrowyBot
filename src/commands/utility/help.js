const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    Colors,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");
const { nitro } = require("../../utils/emojis.json");
const { homeHelper, invitesHelper, boostRewarderHelper, bumpReminderHelper, economyHelper, interchatHelper, utilityHelper } = require("../../helpers/commandHelpers.js");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("help").setDescription("Shows commands information and how to setup some features.").setDMPermission(false),

    async execute(interaction) {
        const categories = [
            {
                label: "Home",
                description: "The home of the help command.",
                value: "home",
                emoji: "🏠",
                embedDescription: homeHelper,
            },
            {
                label: "Invites",
                description: "Reward users for inviting other users.",
                value: "invites",
                emoji: "📩",
                embedDescription: invitesHelper,
            },
            {
                label: "Boost rewarder",
                description: "Reward users for being server boosters.",
                value: "boostrewarder",
                emoji: nitro,
                embedDescription: boostRewarderHelper,
            },
            {
                label: "Bump reminder",
                description: "Remind and reward users for bumping your server. Requires Disboard bot.",
                value: "bumpreminder",
                emoji: "⏰",
                embedDescription: bumpReminderHelper,
            },
            {
                label: "Economy",
                description: "Currency system, set a shop and let users buy items on it.",
                value: "economy",
                emoji: "🏦",
                embedDescription: economyHelper,
            },
            {
                label: "Interchat",
                description: "Chat with other discord servers.",
                value: "interchat",
                emoji: "🌐",
                embedDescription: interchatHelper,
            },
            {
                label: "Utility",
                description: "Useful variety commands.",
                value: "utility",
                emoji: "🧰",
                embedDescription: utilityHelper,
            },
        ];

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(categories[0].embedDescription(interaction));
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("Select a category...")
            .setMaxValues(1)
            .addOptions(
                categories.map((category) => {
                    return new StringSelectMenuOptionBuilder().setLabel(category.label).setDescription(category.description).setValue(category.value).setEmoji(category.emoji);
                })
            );
        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({ embeds: [embed], components: [row] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
            time: 600_000,
        });

        collector.on("collect", async (i) => {
            i.deferUpdate();
            const selectedValue = i.values[0];
            const selectedCategory = categories.find((category) => category.value === selectedValue);
            if (selectedCategory) {
                embed.setDescription(await selectedCategory.embedDescription(i));
                reply.edit({ embeds: [embed], components: [row] });
            }
        });
        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
