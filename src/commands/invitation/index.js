const { SlashCommandBuilder } = require("discord.js");
const show = require("./show.js");
const set = require("./set.js");
const setChannel = require("./setChannel.js");
const unsetChannel = require("./unsetChannel.js");

module.exports = {
    category: "invitation",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("invitation")
        .setDescription("Manage invitations")
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("setchannel")
                .setDescription("Set the invitations channel")
                .addChannelOption((option) => option.setName("channel").setDescription("The channel where welcome messages will be displayed."))
        )
        .addSubcommand((subcommand) => subcommand.setName("show").setDescription("Show the official server invitation"))
        .addSubcommand((subcommand) => subcommand.setName("set").setDescription("Set the official server invitation in the invitations channel"))
        .addSubcommand((subcommand) => subcommand.setName("unsetchannel").setDescription("Unset the current invitations channel")),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "setchannel") {
            await setChannel(interaction);
        } else if (interaction.options.getSubcommand() === "show") {
            await show(interaction);
        } else if (interaction.options.getSubcommand() === "set") {
            await set(interaction);
        } else if (interaction.options.getSubcommand() === "unsetchannel") {
            await unsetChannel(interaction);
        }
    },
};
