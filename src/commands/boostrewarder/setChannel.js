const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { embedInfo, embedSuccess, embedError } = require("../../utils/colors.js");

module.exports = {
    category: "boostrewarder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("boostrewarder-setchannel")
        .setDescription("Sets a channel to show the boost rewards.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to display the rewarder messages.")),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!guildConfig.boostRewarderEnabled) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The boost rewarder module is disabled. Enable it with the command `/boostrewarder-enable`");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel && channel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(embedError).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.boostRewarderChannel) {
            const embed = new EmbedBuilder().setColor(embedInfo).setDescription(`The boost rewarder channel is already <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        // Update the 'boostRewarderChannel' field in the guild configuration
        guildConfig.boostRewarderChannel = channel.id;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(embedSuccess).setDescription(`The boost rewarder channel has ben set to <#${guildConfig.boostRewarderChannel}>.`);
        await interaction.reply({ embeds: [embed] });
    },
};
