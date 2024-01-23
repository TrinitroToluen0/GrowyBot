const User = require("../models/UserModel.js");
const logger = require("../utils/logger.js");
const { Guild } = require("discord.js");

async function rewardInviter(inviterId, guild) {
    if (!inviterId) {
        return false;
    }
    if (!(guild instanceof Guild)) {
        throw new Error("The provided guild is not a valid instance of Guild.");
    }
    try {
        let inviter = await User.findOne({ userId: inviterId, guildId: guild.id });
        let guildConfig = await guild.client.getGuildConfig(guild.id);
        // If the inviter doesn't exist in the database, create a new user for the inviter
        if (!inviter) {
            inviter = new User({
                userId: inviterId,
                guildId: guild.id,
                invitations: 0,
            });
        }

        // Increment the inviter's invitation and money count
        inviter.invitations++;
        inviter.money += guildConfig.invitationReward;
        await inviter.save();
        return true;
    } catch (error) {
        logger.error("Reward inviter failed:", error);
        return false;
    }
}

module.exports = rewardInviter;
