const { Events } = require("discord.js");
const User = require("../models/UserModel");
const logger = require("../utils/logger");
const sendMessage = require("../helpers/sendMessage");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        try {
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

            // If the user doesn't exist in the database, create a new user
            if (!user) {
                user = new User({
                    userId: member.user.id,
                    guildId: member.guild.id,
                });
                await user.save();
            }

            // If the user has an inviter, they were in the guild before, no need to fetch invites
            if (user.inviterId) {
                if (user.inviterId === client.user.id) {
                    if (welcomeChannel) await sendMessage(welcomeChannel, `<@${member.user.id}> joined using the official guild invitation.`);
                    return;
                }
                // Fetch the inviter from the database
                let inviter = await User.findOne({ userId: user.inviterId, guildId: member.guild.id });

                // If the inviter doesn't exist in the database, create a new user for the inviter
                if (!inviter) {
                    inviter = new User({
                        userId: user.inviterId,
                        guildId: member.guild.id,
                    });
                }

                // Increment the inviter's invitation and money count
                inviter.invitations++;
                inviter.money += guildConfig.invitationReward;

                // Save the inviter to the database
                await inviter.save();

                if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> was invited by <@${user.inviterId}> who now has ${inviter.invitations} invitations.`);
                return;
            }

            const cachedInvites = client.invites.get(member.guild.id);
            let newInvites = await member.guild.invites.fetch();

            try {
                newInvites = await member.guild.invites.fetch();
            } catch (error) {
                logger.error(`Failed to fetch invites: ${error}`);
                return;
            }

            const usedInvite = newInvites.find((inv) => cachedInvites.get(inv.code) < inv.uses);

            if (!usedInvite) {
                if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> joined.`);
                logger.error(`Used invite not found`);
                return;
            }

            newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
            client.invites.set(member.guild.id, cachedInvites);

            // Set the inviterId
            user.inviterId = usedInvite.inviter.id;
            await user.save();

            // If the used invite code matches the official guild invite code
            if (usedInvite.code === guildConfig.invitationCode) {
                if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> joined using the official guild invitation.`);
                return;
            }

            // Fetch the inviter from the database
            let inviter = await User.findOne({ userId: user.inviterId, guildId: member.guild.id });

            // If the inviter doesn't exist in the database, create a new user for the inviter
            if (!inviter) {
                inviter = new User({
                    userId: user.inviterId,
                    guildId: member.guild.id,
                    invitations: 0,
                });
            }

            // Increment the inviter's invitation and money count
            inviter.invitations++;
            inviter.money += guildConfig.invitationReward;

            // Save the inviter to the database
            await inviter.save();

            if (welcomeChannel) sendMessage(welcomeChannel, `<@${member.user.id}> was invited by <@${user.inviterId}> who now has ${inviter.invitations} invitations.`);
        } catch (error) {
            logger.error(`OnGuildMemberAdd error: ${error}`);
        }
    },
};
