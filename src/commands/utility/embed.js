const {
    Interaction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    Colors,
    TextInputBuilder,
    ModalBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChannelType,
} = require("discord.js");
const logger = require("../../utils/logger");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Shows a modal to easy create an embed message.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel where the embed will be sent.").addChannelTypes(ChannelType.GuildText)),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const modal = new ModalBuilder().setTitle("Embed builder").setCustomId(interaction.id);
        const title = new TextInputBuilder().setCustomId("title").setLabel("Title").setStyle(TextInputStyle.Short).setRequired(false);
        const description = new TextInputBuilder().setCustomId("description").setLabel("Description").setStyle(TextInputStyle.Paragraph).setRequired(false);
        const image = new TextInputBuilder().setCustomId("image").setLabel("Image URL").setStyle(TextInputStyle.Short).setRequired(false);

        const footer = new TextInputBuilder()
            .setCustomId("footer")
            .setLabel("Footer")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Separate the text and the image with '|'")
            .setRequired(false);

        const row = new ActionRowBuilder().addComponents(title);
        const row2 = new ActionRowBuilder().addComponents(description);
        const row3 = new ActionRowBuilder().addComponents(image);
        const row4 = new ActionRowBuilder().addComponents(footer);

        modal.addComponents(row, row2, row3, row4);
        await interaction.showModal(modal);

        try {
            const modalInteraction = await interaction.awaitModalSubmit({ time: 6_000_000 }); // 100 minutes
            const regEx = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;

            const title = modalInteraction.fields.getTextInputValue("title");
            const description = modalInteraction.fields.getTextInputValue("description");
            const image = modalInteraction.fields.getTextInputValue("image");
            const footer = modalInteraction.fields.getTextInputValue("footer");

            const embed = new EmbedBuilder().setColor(Colors.Red);

            if (image && !image.match(regEx)) {
                embed.setDescription("The image given is not valid.");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!title && !description && !image && !footer) {
                embed.setDescription("You cannot send an empty embed.");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (footer.length) {
                if (footer.includes("|")) {
                    let footerText = footer.split("|")[0].trim();
                    let footerIcon = footer.split("|")[1].trim();
                    if (!footerIcon.match(regEx)) {
                        embed.setDescription("The image given in the footer field is not valid.");
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                    embed.setFooter({ text: footerText, iconURL: footerIcon });
                } else {
                    embed.setFooter({ text: footer });
                }
            }

            embed.setColor(Colors.Blue);
            if (title) embed.setTitle(title);
            if (description) embed.setDescription(description);
            if (image) embed.setImage(image);

            const successEmbed = new EmbedBuilder().setColor(Colors.Green).setDescription(`Embed message successfully created at <#${channel.id}>`);
            modalInteraction.reply({ embeds: [successEmbed], ephemeral: true, fetchReply: false });
            channel.send({ embeds: [embed], fetchReply: false });
        } catch (error) {
            logger.error("Embed command failed: ", error);
        }
    },
};
