const { EmbedBuilder, Colors, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const Guild = require("../models/GuildModel.js");
const User = require("../models/UserModel.js");
const { nitro, goldCoin } = require("../utils/emojis.json");
const logger = require("../utils/logger.js");
const sendMessage = require("../helpers/sendMessage.js");
const checkBotPermissions = require("./checkBotPermissions.js");

async function rewardBoosters(client) {
    // Obtén todos los guilds donde está habilitado el boostRewarder y el bot está presente.
    const guilds = await Guild.find({ boostRewarderEnabled: true, botPresent: true });

    // Para cada guild...
    for (const guild of guilds) {
        try {
            // Intenta obtener el guild de Discord correspondiente
            const discordGuild = await client.guilds.fetch(guild.guildId);

            let boostRewarderChannel = false;

            // Si la guild tiene un canal de boostRewarder definido
            if (guild.boostRewarderChannel) {
                // Intenta obtener el objeto TextChannel
                boostRewarderChannel = client.channels.cache.get(guild.boostRewarderChannel);

                // Si no se encontró en el caché, verificar si puede fetchearlo, y fetchearlo.
                if (!boostRewarderChannel && client.canSendMessages(boostRewarderChannel)) {
                    boostRewarderChannel = await client.channels.fetch(guild.boostRewarderChannel);
                }
                if (!boostRewarderChannel) {
                    guild.boostRewarderChannel = null;
                    guild.save();
                }
            }

            // Hardcodeado para testear
            let boosterRole = "1198395369667702875" || discordGuild.roles.premiumSubscriberRole;

            if (!boosterRole) {
                if (boostRewarderChannel) {
                    const embed = new EmbedBuilder()
                        .setDescription(`This server has the \`boost rewarder\` module enabled. But I couldn´t a find a booster role.`)
                        .setColor(Colors.Red);
                    await sendMessage(boostRewarderChannel, { embeds: [embed] });
                }
                continue;
            }

            // Para cada miembro del guild de Discord...
            const members = await discordGuild.members.fetch();
            let messageSent = true;

            for (const member of members.values()) {
                if (!member.roles.cache.has(boosterRole)) {
                    continue;
                }

                // Encuentra el documento del usuario correspondiente en la base de datos
                let user = await User.findOne({ userId: member.id, guildId: guild.guildId });

                if (!user) {
                    user = new User({
                        userId: member.id,
                        guildId: guild.guildId,
                    });
                }

                user.money += guild.boostReward;
                await user.save();

                if (boostRewarderChannel && messageSent !== false) {
                    const embed = new EmbedBuilder()
                        .setTitle(`${nitro} | Daily reward`)
                        .setColor(Colors.Fuchsia)
                        .setDescription(`Thanks, <@!${user.userId}> for being a server booster. \nHere is your ${goldCoin} \`${guild.boostReward}\` daily money reward.`);
                    messageSent = await sendMessage(boostRewarderChannel, { embeds: [embed] });
                }
            }
        } catch (error) {
            logger.error("rewardBoosters failed:", error);
        }
    }
}

module.exports = rewardBoosters;
