const { Interaction, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");
const { invitation } = require("../../utils/emojis.json");

module.exports = {
    category: "",
    cooldown: 5,
    devOnly: true,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder()
        .setName("guild-invites")
        .setDescription("Get the invites of a guild")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) => option.setName("id").setDescription("The ID of the guild")),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const guildId = interaction.options.getString("id") || interaction.guild.id;
        let guild;

        try {
            guild = await interaction.client.guilds.fetch(guildId);
        } catch {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("I am not present in that guild.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("I don't have permissions to get the invites of that guild.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const invites = await guild.invites.fetch();
        const embed = new EmbedBuilder().setColor(Colors.Blue).setFooter({ text: guild.name, iconURL: guild.iconURL() }).setTimestamp();

        if (invites.size > 0) {
            embed.setTitle(`Invites of the guild ${guild.name}`);
            let description = invites.map((invite) => `${invitation} ${invite.url} by **${invite.inviter.username}** (${invite.uses} uses)`).join("\n");
            description = description.substring(0, 4096);
            embed.setDescription(description);
        } else {
            embed.setDescription("There is no invites to get.");
        }

        return interaction.reply({ embeds: [embed] });
    },
};
