const { Events } = require("discord.js");
const User = require("../models/UserModel");
const logger = require("../utils/logger");
const sendMessage = require("../helpers/sendMessage.js");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        try {
            if (member.user.id === client.user.id) return;
            if (member.partial) member = await member.fetch();
            const guildConfig = await client.getGuildConfig(member.guild.id);
            let welcomeChannel;

            if (guildConfig.welcomeChannel) {
                welcomeChannel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
                if (!welcomeChannel) {
                    guildConfig.welcomeChannel = null;
                    guildConfig.save();
                }
            }

            // Fetch the user from the database
            let user = await User.findOne({ userId: member.user.id, guildId: member.guild.id });

            // If the user doesn't exist in the database or doesn't have an inviter, announce their departure
            if (!user || !user.inviterId) {
                if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> left.`);
                return;
            }

            // Fetch the inviter from the database
            let inviter = await User.findOne({ userId: user.inviterId, guildId: member.guild.id });

            // If the inviter doesn't exist in the database, announce the user's departure. This is too rare to happen.
            if (!inviter) {
                if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> left. they were invited by <@${user.inviterId}>`);
                return;
            }

            // Check if the inviter is the bot (official guild invitation)
            if (user.inviterId === client.user.id) {
                if (welcomeChannel) sendMessage(welcomeChannel, `User <@${member.user.id}> left. They had joined using the official guild invitation.`);
            }

            // Decrement the inviter's invitation and money count
            inviter.invitations = Math.max(0, inviter.invitations - 1);
            inviter.money = Math.max(0, inviter.money - guildConfig.invitationReward);

            // Save the inviter to the database
            await inviter.save();

            if (welcomeChannel) {
                sendMessage(welcomeChannel, `<@${member.user.id}> left. they were invited by <@${inviter.userId}> who now has ${inviter.invitations} invitations.`);
            }
        } catch (error) {
            logger.error(`OnGuildMemberRemove error: ${error}`);
        }
    },
};
