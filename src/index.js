require("./db.js");
const { BOT_TOKEN } = require("./config.js");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
require("./utils/errorHandler.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
        // GatewayIntentBits.DirectMessages,
    ],
    partials: [/*Partials.Channel,*/ Partials.GuildMember],
});

global.client = client;

client.commands = new Collection();
client.cooldowns = new Collection();
client.invites = new Collection();
client.guildConfigs = new Collection();

const Guild = require("./models/GuildModel.js");
client.getGuildConfig = async function (guildId) {
    let guild = this.guildConfigs.get(guildId);

    if (!guild) {
        guild = await Guild.findOne({ guildId: guildId });
        if (!guild) {
            guild = new Guild({ guildId: guildId });
            await guild.save();
        }
        this.guildConfigs.set(guildId, guild);
    }

    return guild;
};

const commandHandler = require("./commands");
commandHandler(client);

const eventHandler = require("./events");
eventHandler(client);

client.login(BOT_TOKEN);

// Cada 24 horas, rewardear a los boosters.
const rewardBoosters = require("./helpers/rewardBoosters.js");
const cron = require("node-cron");
cron.schedule("0 0 * * *", () => {
    rewardBoosters(client);
});
