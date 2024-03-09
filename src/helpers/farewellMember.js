const { EmbedBuilder, Colors } = require("discord.js");
const sendMessage = require("../helpers/sendMessage.js");
const User = require("../models/UserModel.js");

async function farewellMember(member, inviterId) {
    const { client } = member;
    const guildConfig = await client.getGuildConfig(member.guild.id);

    if (!guildConfig.welcomeChannel) {
        return false;
    }

    const inviter = await User.findOne({ userId: inviterId, guildId: member.guild.id });

    const farewells = {
        official: `**<@${member.user.id}> left. They had joined using the official guild invitation.**`,
        invitedBy: inviter ? `**<@${member.user.id}> left. They were invited by <@${inviter.userId}> who now has ${inviter.invitations} invitations.**` : "",
        inviterNotFoundInDb: `**<@${member.user.id}> left. They were invited by <@${inviterId}>**`,
        unknown: `**<@${member.user.id}> left.**`,
    };

    const embed = new EmbedBuilder().setColor(Colors.Red).setImage(member.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));

    const channel = await member.guild.channels.fetch(guildConfig.welcomeChannel);
    if (!channel) {
        guildConfig.welcomeChannel = null;
        guildConfig.save();
        return false;
    }

    if (inviterId && !inviter) {
        embed.setDescription(farewells.inviterNotFoundInDb);
    } else if (inviterId === client.user.id) {
        embed.setDescription(farewells.official);
    } else if (inviter && inviter.userId && inviter.invitations) {
        embed.setDescription(farewells.invitedBy);
    } else {
        embed.setDescription(farewells.unknown);
    }

    await sendMessage(channel, { embeds: [embed] });
    return true;
}

module.exports = farewellMember;
