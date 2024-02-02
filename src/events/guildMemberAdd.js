const { Events } = require("discord.js");
const logger = require("../utils/logger.js");
const getInviterId = require("../helpers/getInviterId.js");
const welcomeMember = require("../helpers/welcomeMember.js");
const rewardInviter = require("../helpers/rewardInviter.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        try {
            if (member.bot) return;
            const inviterId = await getInviterId(member);
            await rewardInviter(inviterId, member.guild);
            await welcomeMember(member, inviterId);
        } catch (error) {
            logger.error(`OnGuildMemberAdd failed: `, error);
        }
    },
};
