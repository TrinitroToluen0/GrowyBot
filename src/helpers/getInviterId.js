const { PermissionsBitField } = require("discord.js");
const User = require("../models/UserModel.js");
const logger = require("../utils/logger.js");
const checkBotPermissions = require("./checkBotPermissions.js");

async function getInviterId(member) {
    const { client } = member;
    let user = await User.findOne({ userId: member.user.id, guildId: member.guild.id });

    // If the user doesn't exist in the database, create a new user
    if (!user) {
        user = new User({
            userId: member.user.id,
            guildId: member.guild.id,
        });
        await user.save();
    }

    if (user.inviterId) {
        logger.info(`Found the inviter of "${member.user.username}" from the database.`);
        return user.inviterId;
    }

    if ((await checkBotPermissions(member.guild, PermissionsBitField.Flags.ManageGuild)) !== true) {
        logger.info(`Cannot find the inviter of ${member.user.username} because of missing permissions.`);
        return null;
    }

    const cachedInvites = client.invites.get(member.guild.id);
    let fetchedInvites = await member.guild.invites.fetch();

    const usedInvite = fetchedInvites.find((inv) => cachedInvites.get(inv.code) < inv.uses);
    if (!usedInvite) {
        logger.info(`Cannot find the inviter of "${member.user.username}". Is bot: ${member.bot}`);
        return null;
    }

    fetchedInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
    client.invites.set(member.guild.id, cachedInvites);
    user.inviterId = usedInvite.inviter.id;
    await user.save();
    logger.info(`Found the inviter of "${member.user.username}" by calculating the code uses of the invitations.`);
    return usedInvite.inviter.id;
}

module.exports = getInviterId;
