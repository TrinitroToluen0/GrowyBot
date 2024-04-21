const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionsBitField, EmbedBuilder, WebhookClient, italic, Colors, Interaction } = require("discord.js");
const Guild = require("../../models/GuildModel.js");
const { INTERCHAT_MOD_TEAM } = require("../../config.js");
const { trash, moderator } = require("../../utils/emojis.json");
const isInterchatChannel = require("../../helpers/isInterchatChannel.js");

module.exports = {
    category: "interchat",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new ContextMenuCommandBuilder().setName("Delete message").setType(ApplicationCommandType.Message).setDMPermission(false),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        if (!interaction.targetMessage.embeds[0] || !(await isInterchatChannel(interaction.targetMessage.channelId))) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("You cannot delete this message.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const messageURL = interaction.targetMessage.embeds[0].data.url;
        const messageAuthor = interaction.targetMessage.embeds[0].data.author.url.split("/").pop();

        if (messageURL.includes("&isDeleted=true")) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("This message is already deleted.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const guilds = await Guild.find({ "interchatChannels.id": interaction.targetMessage.channelId, botPresent: true });

            if (guilds.length === 0) {
                const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("Guild not found or bot not present in guild.");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let description = `${trash} This message was deleted by its author.`;

            if (messageAuthor !== interaction.user.id) {
                if (INTERCHAT_MOD_TEAM.includes(interaction.user.id)) {
                    description = `${moderator} This message was deleted by the interchat moderation team.`;
                } else {
                    const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("You cannot delete this message.");
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            guilds.forEach(async (guild) => {
                const channel = await interaction.client.channels.fetch(guild.interchatChannels.find((ch) => ch.id.toString() === interaction.targetMessage.channel.id));
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find((hook) => hook.owner.id === interaction.client.user.id);

                if (!webhook) {
                    return;
                }

                const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

                let messages;
                if (INTERCHAT_MOD_TEAM.includes(interaction.user.id)) {
                    messages = await channel.messages.fetch({ limit: 100 });
                } else {
                    messages = await channel.messages.fetch({ limit: 20 });
                }

                messages.forEach(async (message) => {
                    if (message.embeds[0] && message.embeds[0].data.url === messageURL) {
                        let embed = new EmbedBuilder(message.embeds[0]);
                        embed.setDescription(italic(description));
                        embed.setImage(null);
                        embed.setURL(messageURL + "&isDeleted=true");
                        embed.setFooter(null);
                        return await webhookClient.editMessage(message, { embeds: [embed], components: [], files: [] });
                    }
                });
            });

            const embed = new EmbedBuilder().setDescription("You successfully deleted this message.").setColor(Colors.Green);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("Error deleting message:", error);
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("An error occurred while deleting the message.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
