const { EmbedBuilder, User, Guild } = require("discord.js");
const logger = require("../utils/logger.js");
const CustomEvents = require("../helpers/customEvents.js");
const { setBumpReminder, getFutureBumpDate, bumpReward } = require("../helpers/bumpReminder.js");
const { goldCoin } = require("../utils/emojis.json");

module.exports = {
    name: CustomEvents.Bump,
    async execute(client, bumper, guild) {
        try {
            if (!(bumper instanceof User)) {
                throw new Error("The provided bumper is not a valid instance of User.");
            }

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
            const channelMessages = await channel.messages.fetch();
            const bumpMessage = channelMessages.find((message) => message.embeds[0]?.data.description.includes("Bump the server") && message.author.id === guild.client.user.id);
            if (bumpMessage) await bumpMessage.delete();

            const userEmbed = new EmbedBuilder()
                .setColor(2406327)
                .setImage(bumper.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
                .setTitle(`${bumper.username} has bumped the server!`)
                .setDescription(`They have won ${goldCoin} \`${guildConfig.bumpReward}\``);

            const dateEmbed = new EmbedBuilder().setColor(2406327).setDescription(`You can bump again <t:${futureTimestamp}:R>`);

            const thankerChannel = await guild.channels.fetch(guildConfig.bumpThankerChannel);
            if (thankerChannel) await thankerChannel.send({ embeds: [userEmbed, dateEmbed] });

            // Programa el próximo bump
            guildConfig.nextBumpReminder = futureBumpDate;
            await guildConfig.save();
            setBumpReminder(guild);
        } catch (error) {
            logger.error("OnBump error: ", error);
        }
    },
};
