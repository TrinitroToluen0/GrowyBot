const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors } = require("discord.js");

module.exports = {
    category: "invites",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.CreateInstantInvite],
    data: new SlashCommandBuilder()
        .setName("invite-set")
        .setDescription("Sets the official guild invitation.")
        .addChannelOption((option) => option.setName("channel").setDescription("The channel where the invite will be created."))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        let invitationChannel = interaction.options.getChannel("channel") || interaction.channel;

        if (invitationChannel && invitationChannel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        if (guildConfig.invitationCode) {
            // TODO: Ask the user for a confirmation, ¿Are you sure? This will delete your current official invitation.
            let invite = await interaction.guild.invites.fetch(guildConfig.invitationCode);
            if (invite) await invite.delete();
        }

        const invite = await invitationChannel.createInvite({
            maxAge: 0,
            maxUses: 0,
        });

        guildConfig.invitationCode = invite.code;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The official guild invitation has ben set to ${invite.url}`);
        await interaction.reply({ embeds: [embed] });
    },
};
