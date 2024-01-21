const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { embedInfo, embedSuccess, embedError } = require("../../utils/colors.js");

module.exports = {
    category: "welcome",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("welcome-setchannel")
        .setDescription("Sets a channel to display the welcome messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the welcome messages.")),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!guildConfig.welcomeEnabled) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The welcome messages module is disabled. Enable it with the command `/welcome-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel && channel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.welcomeChannel) {
            const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The welcome messages channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'welcomeEnabled' field in the guild configuration
        guildConfig.welcomeChannel = channel.id;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The welcome messages channel has ben set to <#${guildConfig.welcomeChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
