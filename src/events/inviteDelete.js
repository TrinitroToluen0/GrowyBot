const { Events } = require("discord.js");

module.exports = {
    name: Events.InviteDelete,
    async execute(client, invite) {
        // Get the cached invites for the guild and remove the deleted invite from the cache
        const cachedInvites = client.invites.get(invite.guild.id);
        if (cachedInvites) {
            cachedInvites.delete(invite.code);
            client.invites.set(invite.guild.id, cachedInvites);
        }
    },
};
