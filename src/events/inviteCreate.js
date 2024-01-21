const { Events } = require("discord.js");

module.exports = {
    name: Events.InviteCreate,
    async execute(client, invite) {
        // Get the cached invites for the guild and update the cache with the new invite
        const cachedInvites = client.invites.get(invite.guild.id) || new Map();
        cachedInvites.set(invite.code, invite.uses);
        client.invites.set(invite.guild.id, cachedInvites);
    },
};
