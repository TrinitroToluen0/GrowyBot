const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const sendToInterchat = require("../../helpers/interchat.js");
const { join } = require("../../utils/emojis.json");

module.exports = {
    category: "interchat",
    cooldown: 60,
    botPermissions: [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ManageChannels],
    data: new SlashCommandBuilder()
        .setName("interchat-join")
        .setDescription("Joins to an interchat server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) =>
            option
                .setName("server")
                .setDescription("The interchat server you want to join.")
                .addChoices({ name: "English", value: "English" }, { name: "Español", value: "Español" })
                .setRequired(true)
        ),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let server = interaction.options.getString("server");
        let channel = interaction.channel;

        if (channel && channel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("The channel must be a valid text channel.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!client.canSendMessages(channel)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`Make sure I have permissions to view and send messages to <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        if (channel.id === guildConfig.interchatChannel.id && server === guildConfig.interchatChannel.server) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`You already joined to the server \`${server}\` in the channel <#${channel.id}>.`);
            return await interaction.reply({ embeds: [embed] });
        }

        await channel.setRateLimitPerUser(5);

        guildConfig.interchatChannel.id = channel.id;
        guildConfig.interchatChannel.server = server;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
                `You have joined to the server \`${server}\`. You will now receive messages from another guilds in the channel <#${guildConfig.interchatChannel.id}>.`
            );
        await interaction.reply({ embeds: [embed] });

        embed.setDescription(`The guild **${interaction.guild.name}** has joined to the interchat!\n\n${interaction.guild.description ? interaction.guild.description : ""}`);
        embed.setImage(interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 }));
        const invites = await interaction.guild.invites.fetch();
        const officialInvite = invites.find((invite) => invite.inviter.id === interaction.client.user.id);

        const components = [];
        if (officialInvite) {
            const joinButton = new ButtonBuilder().setLabel("Join guild").setStyle(ButtonStyle.Link).setURL(officialInvite.url).setEmoji(join);
            const row = new ActionRowBuilder().addComponents(joinButton);
            components.push(row);
        }
        sendToInterchat({ embeds: [embed], components, files: [], guildId: interaction.guild.id }, server);
    },
};
