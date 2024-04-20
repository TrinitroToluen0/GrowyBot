const User = require("../models/UserModel.js");
const { EmbedBuilder } = require("discord.js");
const { goldCoin } = require("../utils/emojis.json");
const cron = require("node-cron");

async function setBumpReminder(guild) {
    const guildConfig = await guild.client.getGuildConfig(guild.id);
    if (!guildConfig.nextBumpReminder) guildConfig.nextBumpReminder = getFutureBumpDate();
    guildConfig.save();

    // Calcula la hora del próximo recordatorio en formato cron
    const bumpDate = guildConfig.nextBumpReminder;
    const cronTime = `${bumpDate.getSeconds()} ${bumpDate.getMinutes()} ${bumpDate.getHours()} ${bumpDate.getDate()} ${bumpDate.getMonth() + 1} *`;

    // Programa la tarea
    const task = cron.schedule(cronTime, async () => {
        const channel = await guild.channels.fetch(guildConfig.bumpReminderChannel);

        // Eliminar el mensaje de timer
        const channelMessages = await channel.messages.fetch();
        const timerMessage = channelMessages.find((message) => message.embeds[1]?.data.description.includes("You can bump again") && message.author.id === guild.client.user.id);
        if (timerMessage) await timerMessage.edit({ embeds: [timerMessage.embeds[0]] });

        let content;

        if (guildConfig.bumpReminderRole) {
            isEveryoneRole = guildConfig.bumpReminderRole === guild.roles.everyone.id;
            content = isEveryoneRole ? "@everyone" : `<@&${guildConfig.bumpReminderRole}>`;
        }

        // Enviar el remind embed
        const bumpEmbed = new EmbedBuilder()
            .setColor(2406327)
            .setTitle("It's time to bump again!")
            .setDescription(`Bump the server using the command </bump:947088344167366698> to win ${goldCoin} \`${guildConfig.bumpReward}\` `);
        channel.send({ embeds: [bumpEmbed], content });
        task.stop();
    });
}

function getFutureBumpDate() {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 7200;
    return new Date(futureTimestamp * 1000);
}

async function bumpReward(bumperId, guild) {
    const guildConfig = await guild.client.getGuildConfig(guild.id);

    let user = await User.findOne({ userId: bumperId, guildId: guild.id });
    if (!user) {
        user = new User({
            userId: bumperId,
            guildId: guild.id,
        });
    }

    user.money += guildConfig.bumpReward;
    return await user.save();
}

module.exports = {
    setBumpReminder,
    getFutureBumpDate,
    bumpReward,
};
