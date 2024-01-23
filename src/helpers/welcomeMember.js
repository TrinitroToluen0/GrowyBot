const sendMessage = require("../helpers/sendMessage.js");
const User = require("../models/UserModel.js");

async function welcomeMember(member, inviterId) {
    const { client } = member;
    const guildConfig = await client.getGuildConfig(member.guild.id);
    const inviter = await User.findOne({ userId: inviterId, guildId: member.guild.id });

    const greetings = {
        official: `<@${member.user.id}> joined using the official guild invitation.`,
        invitedBy: `<@${member.user.id}> was invited by <@${inviter.userId}> who now has ${inviter.invitations} invitations.`,
        inviterNotFoundInDb: `<@${member.user.id}> was invited by <@${inviterId}>`,
        unknown: `<@${member.user.id}> joined.`,
    };

    if (!guildConfig.welcomeChannel) {
        return false;
    }

    const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
    if (!channel) {
        guildConfig.welcomeChannel = null;
        guildConfig.save();
        return false;
    }

    if (!inviterId) {
        await sendMessage(channel, greetings.unknown);
        return true;
    }

    if (!inviter) {
        // Rare case, because rewardInviter always creates an inviter profile if the inviter was not found.
        await sendMessage(channel, greetings.inviterNotFoundInDb);
        return true;
    }

    if (inviterId === client.user.id) {
        await sendMessage(channel, greetings.official);
        return true;
    }

    await sendMessage(channel, greetings.invitedBy);
    return true;
}

module.exports = welcomeMember;
