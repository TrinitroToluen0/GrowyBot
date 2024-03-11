const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, Colors, roleMention } = require("discord.js");

module.exports = {
    category: "bumpreminder",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("bumpreminder-setrole")
        .setDescription("Sets a role to mention when reminding your users to bump your server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addRoleOption((option) => option.setName("role").setDescription("The role to mention.").setRequired(true)),

    async execute(interaction) {
        const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
        const role = interaction.options.getRole("role");
        isEveryoneRole = interaction.guild.roles.everyone.id === role.id;

        if (!guildConfig.bumpReminderEnabled) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription("The bump reminder module is disabled. Enable it with the command </bumpreminder-enable:1201445092129517611>");
            return interaction.reply({ embeds: [embed] });
        }

        if (role.id === guildConfig.bumpReminderRole) {
            const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(`The bump reminder role is already ${isEveryoneRole ? "@everyone" : `<@&${role.id}>`}.`);
            return await interaction.reply({ embeds: [embed] });
        }

        guildConfig.bumpReminderRole = role.id;
        await guildConfig.save();

        // Send a confirmation message
        const embed = new EmbedBuilder().setColor(Colors.Green).setDescription(`The bump reminder role has been set to ${isEveryoneRole ? "@everyone" : `<@&${role.id}>`}.`);
        await interaction.reply({ embeds: [embed] });
    },
};
