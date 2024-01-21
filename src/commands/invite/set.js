const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { embedSuccess, embedError } = require("../../utils/colors.js");

module.exports = {
    category: "invites",
    cooldown: 5,
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
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        if (guildConfig.invitationCode) {
            // TODO: Ask the user for a confirmation, ¿Are you sure? This will delete your current official invitation.
            let invite = await interaction.guild.invites.fetch(guildConfig.invitationCode);
            await invite.delete();
        }

        const invite = await invitationChannel.createInvite({
            maxAge: 0,
            maxUses: 0,
        });

        guildConfig.invitationCode = invite.code;
        await guildConfig.save();

        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The official guild invitation has ben set to ${invite.url}`);
        await interaction.reply({ embeds: [embed] });
    },
};
