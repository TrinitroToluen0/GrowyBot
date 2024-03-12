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
            const guildConfig = await client.getGuildConfig(member.guild.id);
            const inviterId = await getInviterId(member);
            await farewellMember(member, inviterId);
            let inviter = await User.findOne({ userId: inviterId, guildId: member.guild.id });
            if (inviter) {
                inviter.invitations = Math.max(0, inviter.invitations - 1);
                inviter.money -= guildConfig.invitationReward;
                await inviter.save();
            }
        } catch (error) {
            logger.error(`OnGuildMemberRemove failed: `, error);
        }
    },
};
