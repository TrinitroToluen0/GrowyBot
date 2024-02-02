const User = require("../models/UserModel.js");
const { EmbedBuilder, Guild } = require("discord.js");
const { goldCoin } = require("../utils/emojis.json");
const cron = require("node-cron");
const logger = require("../utils/logger.js");

async function onBump(bumper, guild) {
    if (!(guild instanceof Guild)) {
        throw new Error("The provided guild is not a valid instance of Guild.");
    }
    const guildConfig = await guild.client.getGuildConfig(guild.id);
    if (!guildConfig.bumpReminderEnabled) return;

    bumpReward(bumper.id, guild);

    const futureBumpDate = getFutureBumpDate();
    const futureTimestamp = Math.floor(futureBumpDate.getTime() / 1000);

    // Eliminar el mensaje de bump
    const channel = await guild.channels.fetch(guildConfig.bumpReminderChannel);
    const channelMessages = await channel.messages.fetch({ limit: 10 });
    const bumpMessage = channelMessages.find((message) => message.embeds[0]?.data.description.includes("Bump the server") && message.author.id === guild.client.user.id);
    if (bumpMessage) await bumpMessage.delete();

    const userEmbed = new EmbedBuilder()
        .setColor(2406327)
        .setImage(bumper.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        .setTitle(`${bumper.username} has bumped the server!`)
        .setDescription(`They have won ${goldCoin} \`${guildConfig.bumpReward}\``);

    const dateEmbed = new EmbedBuilder().setColor(2406327).setDescription(`You can bump again <t:${futureTimestamp}:R>`);

    await channel.send({ embeds: [userEmbed, dateEmbed] });

    // Programa el próximo bump
    guildConfig.nextBumpReminder = futureBumpDate;
    await guildConfig.save();
    setBumpReminder(guild);
}

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
        const channelMessages = await channel.messages.fetch({ limit: 10 });
        const timerMessage = channelMessages.find(
            (message) => message.embeds[1]?.data.description.includes("You can bump again") && message.author.id === guild.client.user.id
        );
        if (timerMessage) await timerMessage.edit({ embeds: [timerMessage.embeds[0]] });

        let content;

        if (guildConfig.bumpReminderRole) {
            isEveryoneRole = guildConfig.bumpReminderRole === guild.roles.everyone.id;
            content = isEveryoneRole ? "@everyone" : `<&${guildConfig.bumpReminderRole}>`;
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
    const futureTimestamp = Math.floor(Date.now() / 1000) + 15;
    return new Date(futureTimestamp * 1000);
    // TODO: Cambiar al código real que aumenta 2 horas al timer
    // const futureTimestamp = Math.floor(Date.now() / 1000) + 7200;
    // return new Date(futureTimestamp * 1000);
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
    onBump,
    setBumpReminder,
};
