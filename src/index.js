require("./db.js");
const { BOT_TOKEN } = require("./config.js");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("./utils/errorHandler.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

const commandHandler = require("./commands");
commandHandler(client);

const eventHandler = require("./events");
eventHandler(client);

client.login(BOT_TOKEN);
