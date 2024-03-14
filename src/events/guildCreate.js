const { Events, PermissionsBitField, EmbedBuilder, Colors, Guild } = require("discord.js");
const logger = require("../utils/logger.js");
const { green, reset } = require("../utils/colors.js");
const checkBotPermissions = require("../helpers/checkBotPermissions.js");

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild) {
        try {
            logger.info(`${green}Bot was added to the guild "${guild.name}". Member count: ${client.guilds.cache.get(guild.id).memberCount}${reset}`);
            const guildConfig = await client.getGuildConfig(guild.id);
            guildConfig.botPresent = true;
            await guildConfig.save();
            await checkPerms(guild);
            // Fetch and cache the invites of the new guild
            if (await checkBotPermissions(guild, [PermissionsBitField.Flags.ManageGuild])) {
                const invites = await guild.invites.fetch();
                client.invites.set(guild.id, invites);
            }
        } catch (error) {
            logger.error("OnGuildCreate failed: ", error);
        }
    },
};

async function checkPerms(guild) {
    if (!(guild instanceof Guild)) {
        throw new Error("The provided guild is not a valid instance of Guild.");
    }
    const requiredPermissions = [
        PermissionsBitField.Flags.UseExternalEmojis,
        PermissionsBitField.Flags.ManageGuild,
        PermissionsBitField.Flags.CreateInstantInvite,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ManageWebhooks,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.MentionEveryone,
    ];

    // Checkear permisos
    const missingPermissions = await checkBotPermissions(guild, requiredPermissions);
    if (missingPermissions === true) return true;

    const owner = await guild.fetchOwner();
    if (!owner) return;
    const embed = new EmbedBuilder()
        .setDescription(
            `Hello, dear owner of \`${guild.name}\`. I am missing some important permissions on your guild that I need to work properly. 

            Please go to \`Server settings > Roles > Growy\` and grant me the following permissions:

            ${missingPermissions.join(", ")}

            If you don't find a "Growy" role, please create one and assign it to me. Otherwise, most of my features won't work on your guild.`
        )
        .setColor(Colors.Red);
    owner.send({ embeds: [embed] });
    logger.warn(`The bot has been added to the guild ${guild.name} (${guild.id}) with missing permissions.`);
    return false;
}
