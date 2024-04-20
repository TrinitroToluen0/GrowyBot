const Guild = require("./../models/GuildModel.js");

const isInterchatChannel = async (channelId) => {
    const guild = await Guild.findOne({ "interchatChannels.id": channelId });
    return guild !== null;
};

module.exports = isInterchatChannel;
