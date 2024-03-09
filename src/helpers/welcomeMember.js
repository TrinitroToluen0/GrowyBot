const { EmbedBuilder, Colors } = require("discord.js");
const sendMessage = require("../helpers/sendMessage.js");
const User = require("../models/UserModel.js");

async function welcomeMember(member, inviterId) {
    const { client } = member;
    const guildConfig = await client.getGuildConfig(member.guild.id);

    if (!guildConfig.welcomeChannel) {
        return false;
    }

    const inviter = await User.findOne({ userId: inviterId, guildId: member.guild.id });

    const greetings = {
        official: `**<@${member.user.id}> joined using the official guild invitation.**`,
        invitedBy: inviter ? `**<@${member.user.id}> was invited by <@${inviter.userId}> who now has ${inviter.invitations} invitations.**` : "",
        inviterNotFoundInDb: `**<@${member.user.id}> was invited by <@${inviterId}>**`,
        unknown: `**<@${member.user.id}> joined.**`,
    };

    const embed = new EmbedBuilder().setColor(Colors.Green).setImage(member.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));

    const channel = await member.guild.channels.fetch(guildConfig.welcomeChannel);
    if (!channel) {
        guildConfig.welcomeChannel = null;
        guildConfig.save();
        return false;
    }

    if (inviterId && !inviter) {
        embed.setDescription(greetings.inviterNotFoundInDb);
    } else if (inviterId === client.user.id) {
        embed.setDescription(greetings.official);
    } else if (inviter && inviter.userId && inviter.invitations) {
        embed.setDescription(greetings.invitedBy);
    } else {
        embed.setDescription(greetings.unknown);
    }

    await sendMessage(channel, { embeds: [embed] });
    return true;
}

module.exports = welcomeMember;
