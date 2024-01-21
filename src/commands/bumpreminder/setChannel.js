const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { embedInfo, embedSuccess, embedError } = require("../../utils/colors.js");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setchannel")
        .setDescription("Sets a channel that will unlock every 2 hours to remind @here to bump the guild for a reward.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the reminder messages.")),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!guildConfig.bumpReminderEnabled) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The bump reminder module is disabled. Enable it with the command `/bumpreminder-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel && channel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.bumpReminderChannel) {
            const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The bump reminder channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'bumpReminderChannel' field in the guild configuration
        guildConfig.bumpReminderChannel = channel.id;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The bump reminder channel has been set to <#${guildConfig.bumpReminderChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
