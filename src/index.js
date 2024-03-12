console.clear();
const logger = require("./utils/logger.js");
logger.info(`Current working directory: ${process.cwd()}`);
require("./db.js");
const { BOT_TOKEN } = require("./config.js");
const { Client, Collection, GatewayIntentBits, Partials, TextChannel, PermissionsBitField } = require("discord.js");
require("./utils/errorHandler.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.GuildMember],
});

global.client = client;

client.commands = new Collection();
client.cooldowns = new Collection();
client.invites = new Collection();
client.guildConfigs = new Collection();

const Guild = require("./models/GuildModel.js");
client.getGuildConfig = async (guildId) => {
    let guild = client.guildConfigs.get(guildId);

    if (!guild) {
        guild = await Guild.findOne({ guildId: guildId });
        if (!guild) {
            guild = new Guild({ guildId: guildId });
            await guild.save();
        }
        client.guildConfigs.set(guildId, guild);
    }

    return guild;
};

client.canSendMessages = (channel) => {
    if (!(channel instanceof TextChannel)) {
        throw new Error("The provided channel is not a valid instance of TextChannel.");
    }
    try {
        const botPermissions = channel.permissionsFor(channel.client.user);

        if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
            return false;
        }

        if (!botPermissions.has(PermissionsBitField.Flags.SendMessages)) {
            return false;
        }

        return true;
    } catch (error) {
        logger.error("canSendMessages failed: ", error);
        return false;
    }
};

const commandHandler = require("./commands");
commandHandler(client);

const eventHandler = require("./events");
eventHandler(client);

client.login(BOT_TOKEN);

// A las 4PM, rewardear a los boosters.
const rewardBoosters = require("./helpers/rewardBoosters.js");
const cron = require("node-cron");
cron.schedule("0 16 * * *", () => {
    rewardBoosters(client);
});
