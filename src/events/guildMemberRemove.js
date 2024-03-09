const { Events } = require("discord.js");
const User = require("../models/UserModel");
const logger = require("../utils/logger");
const farewellMember = require("../helpers/farewellMember.js");
const getInviterId = require("../helpers/getInviterId.js");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        try {
            if (member.bot) return;
            const guildConfig = client.getGuildConfig(member.guild.id);
            const inviterId = await getInviterId(member);
            let inviter = await User.findOne({ userId: inviterId, guildId: member.guild.id });
            if (inviter) {
                // Decrement the inviter's invitation and money count
                inviter.invitations = Math.max(0, inviter.invitations - 1);
                inviter.money = Math.max(0, inviter.money - guildConfig.invitationReward);

                // Save the inviter to the database
                await inviter.save();
            }
            await farewellMember(member, inviterId);
        } catch (error) {
            logger.error(`OnGuildMemberRemove failed: `, error);
        }
    },
};
