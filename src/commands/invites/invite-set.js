const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType } = require("discord.js");

module.exports = {
    category: "invites",
    cooldown: 2,
    botPermissions: [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.CreateInstantInvite],
    data: new SlashCommandBuilder()
        .setName("invite-set")
        .setDescription("Sets the official guild invitation.")
        .addChannelOption((option) => option.setName("channel").setDescription("The channel where the invitation will be created.").addChannelTypes(ChannelType.GuildText))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const invitationChannel = interaction.options.getChannel("channel") || interaction.channel;

        if (invitationChannel.type !== ChannelType.GuildText) {
            const embed = new EmbedBuilder().setColor(Colors.Red).setDescription("The channel must be a valid text channel.");
            return interaction.reply({ embeds: [embed] });
        }

        const createInvite = async () => {
            return await invitationChannel.createInvite({
                maxAge: 0,
                maxUses: 0,
            });
        };

        const invites = await interaction.guild.invites.fetch();
        const botInvite = invites.find((invite) => invite.inviter.id === interaction.client.user.id);

        // Si se encuentra una invitación creada por el bot, enviar mensaje de confirmación al usuario para comprobar que quiera eliminarla.
        if (botInvite) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Yellow)
                .setDescription(`Are you sure you want to set a new official invite? This will delete your current official invite which has \`${botInvite.uses}\` uses.`);
            const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Secondary).setEmoji("❌");
            const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("Confirm").setStyle(ButtonStyle.Success).setEmoji("✅");
            const row = new ActionRowBuilder().addComponents(cancel, confirm);

            const reply = await interaction.reply({
                embeds: [embed],
                components: [row],
                fetchReply: true,
            });

            const collector = reply.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                componentType: ComponentType.Button,
                time: 15000,
            });

            let isEdited = false;
            collector.on("collect", async (i) => {
                await i.deferUpdate();

                if (i.customId === "cancel") {
                    embed.setDescription("You cancelled.");
                    embed.setColor(Colors.Blue);
                    await reply.edit({ embeds: [embed], components: [] });
                    isEdited = true;
                }

                if (i.customId === "confirm") {
                    await botInvite.delete();
                    const newInvite = await createInvite();
                    const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The official guild invite has been set to ${newInvite.url}`);
                    await reply.edit({ embeds: [embed], components: [] });
                    isEdited = true;
                }
            });

            collector.on("end", () => {
                if (isEdited) return;
                cancel.setDisabled(true);
                confirm.setDisabled(true);
                reply.edit({
                    components: [row],
                });
            });
        } else {
            const newInvite = await createInvite();
            const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The official guild invite has been set to ${newInvite.url}`);
            await interaction.reply({ embeds: [embed] });
        }
    },
};
