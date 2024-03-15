const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    ChannelType,
    Colors,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Interaction,
    ComponentType,
} = require("discord.js");
const sendToInterchat = require("../../helpers/interchat.js");
const { join } = require("../../utils/emojis.json");
const Guild = require("../../models/GuildModel.js");
const logger = require("../../utils/logger.js");

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
        )
        .addChannelOption((option) =>
            option.setName("channel").setDescription("If specified, i will use the specified channel instead of creating a new channel").addChannelTypes(ChannelType.GuildText)
        ),

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        let server = interaction.options.getString("server");
        let channel = interaction.options.getChannel("channel");
        if (channel && !client.canSendMessages(channel)) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription(`Make sure I have permissions to view and send messages to <#${channel.id}>.`);
            return interaction.reply({ embeds: [embed] });
        }

        const existingChannel = await Guild.findOne({ "interchatChannels.server": server, guildId: interaction.guild.id });
        if (existingChannel) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`A channel for the server \`${server}\` already exists on this Discord server. You cannot have two channels joined to the interchat same server.`);
            return interaction.reply({ embeds: [embed] });
        }

        const invites = await interaction.guild.invites.fetch();
        const officialInvite = invites.find((invite) => invite.inviter.id === interaction.client.user.id);

        // TODO: aquí se pregunta al usuario si quiere establecer una invitación oficial
        if (!officialInvite) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`Would you like to set an official invite first? This will show a "Join guild" button whenever your members chat on the interchat.`);
            const yesButton = new ButtonBuilder().setCustomId("yes").setLabel("Yes, set an official invite.").setEmoji("✅").setStyle(ButtonStyle.Success);
            const noButton = new ButtonBuilder().setCustomId("no").setLabel("No, continue without official invite.").setEmoji("❌").setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(yesButton, noButton);
            const reply = await interaction.reply({ embeds: [embed], components: [row] });
            const collector = reply.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, componentType: ComponentType.Button, time: 10_000 });

            let updated = false;
            await new Promise((resolve, reject) => {
                collector.once("collect", async (i) => {
                    i.deferUpdate();
                    if (i.customId === "yes") {
                        const embed = new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setDescription(
                                `Nice! You can set up an official invite with the command </invite-set:1202024120062312558>. Then use again </interchat-join:1201445092255338578> to join the interchat.`
                            );
                        updated = true;
                        return await interaction.editReply({ embeds: [embed], components: [] });
                    }
                    resolve(i);
                });

                collector.once("end", async () => {
                    if (!updated) {
                        noButton.setDisabled(true);
                        yesButton.setDisabled(true);
                        return await interaction.editReply({ embeds: [embed], components: [row] });
                    }
                });
            });
        }

        if (!channel) {
            channel = await interaction.guild.channels.create({
                name: `【🌐】interchat-${server.slice(0, 2)}`,
                type: ChannelType.GuildText,
                topic: `Chat with other Discord servers. Thanks to <@${interaction.client.user.id}>`,
            });
        }

        channel.setRateLimitPerUser(5);

        guildConfig.interchatChannels.push({
            id: channel.id,
            server: server,
        });
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
                `Great! I have set the channel <#${channel.id}> as an interchat channel, You can now receive messages from other Discord guilds that have also joined the server \`${server}\`.`
            );
        await interaction.reply({ embeds: [embed], components: [] });

        embed.setDescription(`The guild **${interaction.guild.name}** has joined to the interchat!\n\n${interaction.guild.description ? interaction.guild.description : ""}`);
        embed.setImage(interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 }));

        const components = [];
        if (officialInvite) {
            const joinButton = new ButtonBuilder().setLabel("Join guild").setStyle(ButtonStyle.Link).setURL(officialInvite.url).setEmoji(join);
            const row = new ActionRowBuilder().addComponents(joinButton);
            components.push(row);
        }
        sendToInterchat({ embeds: [embed], components, files: [], guildId: interaction.guild.id }, server);
    },
};
