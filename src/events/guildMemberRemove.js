const { Events } = require("discord.js");
const logger = require("../utils/logger.js");
const getInviterId = require("../helpers/getInviterId.js");
const farewellMember = require("../helpers/farewellMember.js");
const unrewardInviter = require("../helpers/unrewardInviter.js");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        try {
            if(member.user.id === client.user.id) return;
            const inviterId = await getInviterId(member);
            await unrewardInviter(inviterId, member.guild);
            await farewellMember(member, inviterId);
        } catch (error) {
            logger.error(`OnGuildMemberAdd failed: `, error);
        }
    },
};
