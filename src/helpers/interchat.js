const { PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors, Message, blockQuote, WebhookClient, italic } = require("discord.js");
const checkBotPermissions = require("../helpers/checkBotPermissions.js");
const Guild = require("../models/GuildModel.js");
const { join } = require("../utils/emojis.json");
const cheerio = require("cheerio");
const logger = require("../utils/logger.js");

const sendToInterchat = async (message, server) => {
    let toSend;

    if (message instanceof Message) {
        if (message.deletable) await message.delete();
        toSend = await parseMessageObject(message);
        if (toSend === false) {
            return false;
        }
    } else {
        toSend = message;
    }

    await broadcast(toSend, server);
};

const parseMessageObject = async (message) => {
    if (!(message instanceof Message)) {
        throw new Error("The provided message is not a valid instance of Message.");
    }

    if ((await checkBotPermissions(message.guild, PermissionsBitField.Flags.ManageGuild)) !== true) {
        return false;
    }

    if (message.content >= 4096) {
        return false;
    }

    const invites = await message.guild.invites.fetch();
    const officialInvite = invites.find((invite) => invite.inviter.id === message.client.user.id);

    const components = [];
    if (officialInvite) {
        const joinButton = new ButtonBuilder().setLabel("Join guild").setStyle(ButtonStyle.Link).setURL(officialInvite.url).setEmoji(join);
        const row = new ActionRowBuilder().addComponents(joinButton);
        components.push(row);
    }

    let content;
    if (message.reference) {
        const originalMessage = await message.channel.messages.fetch(message.reference.messageId);
        // Si no tiene autor o está eliminado, no se puede referenciar / responder.
        if (originalMessage.embeds[0].data.author && !originalMessage.embeds[0].data.url.includes("&isDeleted=true")) {
            const originalAuthor = originalMessage.embeds[0].data.author.url.split("/").pop();

            let originalContent = originalMessage.embeds[0].data.description;
            if (originalContent) {
                if (originalContent.length > 35) {
                    originalContent = `${originalContent.substring(0, 120)}...`;
                }
            } else {
                originalContent = ":paperclip: message contains attachment";
            }
            content = blockQuote(`<@${originalAuthor}> ➞ ${italic(originalContent)}`);
        }
    }

    const embeds = [];
    if (message.content) {
        const interchatEmbed = new EmbedBuilder().setDescription(message.content);
        if (message.content.includes("tenor.com")) {
            const regex = /(https?:\/\/[^\s$.?#].[^\s]*)/g;
            const urls = message.content.match(regex);
            const tenorUrl = urls.find((url) => url.includes("tenor.com"));

            if (tenorUrl) {
                interchatEmbed.setImage(await getGifFromLink(tenorUrl));
            }
        }
        embeds.push(interchatEmbed);
    }

    const files = [];
    if (message.attachments.size > 0) {
        let index = 0;
        message.attachments.each((attachment) => {
            let embed = new EmbedBuilder();
            if (index === 0 && embeds.length > 0) {
                embed = embeds[0];
            }
            console.debug("ATTACHMENT CONTENT TYPE: ", attachment.contentType);
            if (["image/jpeg", "image/jpg", "image/gif", "image/png"].includes(attachment.contentType)) {
                embed.setImage(attachment.url);
            } else if (["audio/ogg", "video/mp4"].includes(attachment.contentType)) {
                files.push({
                    attachment: attachment.url,
                    name: attachment.name,
                });
            } else {
                embed.setDescription(`${embed.data.description ? embed.data.description : ""}\n\n${attachment.url}`);
            }
            if (index !== 0 || embeds.length === 0) embeds.push(embed);
            index++;
        });
    }

    if (embeds.length >= 10) {
        return false;
    }

    embeds.forEach((embed) => {
        embed
            .setColor(Colors.Blue)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL(), url: `https://discord.com/users/${message.author.id}` })
            .setFooter({ text: `${message.guild.name}  •  ${message.guild.memberCount} members`, iconURL: message.guild.iconURL() })
            .setURL(message.url);
    });

    return {
        content,
        embeds,
        components,
        files,
        guildId: message.guild.id,
    };
};

const broadcast = async (message, server) => {
    const { content, embeds, components, files, guildId } = message;
    const { client } = global;

    const guilds = await Guild.find({ "interchatChannel.server": server, "interchatChannel.id": { $exists: true, $ne: null }, botPresent: true });
    guilds.forEach(async (guild) => {
        const discordGuild = await client.guilds.fetch(guild.guildId);
        if ((await checkBotPermissions(discordGuild, PermissionsBitField.Flags.ManageWebhooks)) !== true) return false;

        const channel = await client.channels.fetch(guild.interchatChannel.id);
        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.find((hook) => hook.owner.id === client.user.id);

        if (!webhook) {
            webhook = await channel.createWebhook({ name: "Growy", avatar: global.client.user.displayAvatarURL() });
        }

        const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

        let ref = [...components];
        if (guildId === guild.guildId) {
            ref = [];
        }

        await webhookClient.send({ content, embeds, files, components: ref });
    });
};

const getGifFromLink = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "image/webp,*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
            },
            compress: true,
        });
        const body = await response.text();
        const $ = cheerio.load(body);
        const gifUrl = $("div.Gif").find("img").attr("src");

        if (gifUrl) return gifUrl;
        else return null;
    } catch (error) {
        logger.error("getGifFromLink failed: ", error);
        return null;
    }
};

module.exports = sendToInterchat;
