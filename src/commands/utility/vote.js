const { Interaction, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    category: "",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("vote").setDescription("Vote for me").setDMPermission(true),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription("You can vote for me clicking the button below!");
        const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://top.gg/bot/${interaction.client.user.id}/vote`).setLabel("Vote for me").setEmoji("🔗");
        const row = new ActionRowBuilder().addComponents(button);
        interaction.reply({ embeds: [embed], components: [row] });
    },
};
