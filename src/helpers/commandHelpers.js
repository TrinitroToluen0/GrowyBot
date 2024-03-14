const { nitro, goldCoin, commands } = require("../utils/emojis.json");
const { SUPPORT_SERVER_INVITE, CLIENT_ID } = require("../config.js");

const homeHelper = async (interaction) => {
    return `# ❓ Need help? This is the place! 
    
Start by selecting the category you want to get help for.

## 🔗 The nexus
[Support server](${SUPPORT_SERVER_INVITE}) • [Invite me](https://discord.com/oauth2/authorize?client_id=1195233538115637308&permissions=537266233&scope=bot) • [Vote for Us!](https://top.gg/bot/${CLIENT_ID}/vote)

    `;
};

const invitesHelper = async (interaction) => {
    const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
    return `# 📩 Invites category \n\n

## :question: How it works?    
With this module, you can track invitations on your guild. You can know who invited who, and reward users for inviting other users.

## ${commands} Available commands
- </invite-set:1202024120062312558> Sets the official guild invitation.
- </invite:1201445092255338581> Shows the official guild invitation.
- </invites:1201445092255338582> Shows the number of invites a user has.
- </invites-leaderboard:1201445092255338583> Displays the top 10 users with the most invites of the guild.
- </invites-setreward:1201445092255338584> Sets the amount of money given for inviting users to the guild.
- </welcome-enable:1201445092389572648> Enables or disables the welcome messages module.
- </welcome-setchannel:1201445092389572649> Sets a channnel to display the welcome messages.

## ⚙️ Actual configuration
- Welcome enabled ➞ \`${guildConfig.welcomeEnabled}\`
- Welcome channel ➞ ${guildConfig.welcomeChannel ? `<#${guildConfig.welcomeChannel}>` : "None"}
- Invite reward ➞ ${goldCoin} \`${guildConfig.invitationReward}\`
`;
};

const boostRewarderHelper = async (interaction) => {
    const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
    return `# ${nitro} Boost rewarder category

## :question: How it works?
Every day at 9:00 P.M UTC, all members of your guild with the Discord-created Booster role will receive a specified amount of money. This amount is determined by you in the configuration. Additionally, these rewarded users will be publicly thanked in a designated channel within your guild, which you also need to set up.

## ${commands} Available commands
- </boostrewarder-enable:1201445092129517608> Enable the boost rewarder module, if the module is disabled, your boosters won't be rewarded.
- </boostrewarder-setchannel:1201445092129517609> Set a channel for the boost rewarder module to publicly thank all of the boosters in your server.
- </boostrewarder-setreward:1201445092129517610> Set the amount of money that your server boosters will get for boosting your server.

## 🤔 To consider
- Your server must have an official booster role created by Discord for this module to properly work.

## ⚙️ Actual configuration
- Enabled ➞ \`${guildConfig.boostRewarderEnabled}\`
- Channel ➞ ${guildConfig.boostRewarderChannel ? `<#${guildConfig.boostRewarderChannel}>` : "None"}
- Daily reward ➞ ${goldCoin} \`${guildConfig.boostReward}\`
`;
};

const bumpReminderHelper = async (interaction) => {
    const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
    let bumpReminderRoleResolved = "None";
    if (guildConfig.bumpReminderRole) {
        let isEveryoneRole = interaction.guild.roles.everyone.id === guildConfig.bumpReminderRole;
        bumpReminderRoleResolved = isEveryoneRole ? "@everyone" : `<@&${guildConfig.bumpReminderRole}>`;
    }

    return `# ⏰ Bump reminder category

## :question: How it works?
When users bump your server executing the comand </bump:947088344167366698>, a timer will be set and 2 hours later, I will remember your users that it's time to bump again. 
Also, you can specify how much money your users can win for bumping your server.

## :question: What is a "bump"? What is Disboard?
Disboard is a website to grow your Discord server, there you can submit your server and invite the Disboard bot.  When a user "bumps" your server, 
it means that they executed the command  </bump:947088344167366698>, which will bump your server to the top of the Disboard website, and therefore, you will gain new 
members, a bump can be done every 2 hours.

## ${commands} Available commands
- </bumpreminder-enable:1201445092129517611> Enable the bump reminder module, if the module is disabled, nothing will happen even if disboard is in your server and a user bumps it.
- </bumpreminder-setchannel:1201445092129517612> Set a channel for the bump reminder module to remind your users when they can bump and publicly thank all of the bumpers in your server.
- </bumpreminder-setreward:1201445092129517613> Set the amount of money that your bumpers will get for bumping your server.
- </bumpreminder-setrole:1202771703688863834> Sets a role to mention when reminding your users to bump your server.

## 🤔 To consider
- This module requires you to have your server submitted and approved on the [Disboard website](https://disboard.org/).
- This module requires you to have the Disboard bot setup in your server.

## ⚙️ Actual configuration
- Enabled ➞ \`${guildConfig.bumpReminderEnabled}\`
- Channel ➞ ${guildConfig.bumpReminderChannel ? `<#${guildConfig.bumpReminderChannel}>` : "None"}
- Reward ➞ ${goldCoin} \`${guildConfig.bumpReward}\`
- Role ➞ ${bumpReminderRoleResolved}
`;
};

const economyHelper = async (interaction) => {
    const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
    return `# 🏦 Economy category

## :question: How it works?
This is a currency system that allows users to buy items on your guild shop configured by you.

## :question: How can my users earn money?
As you might see, there are a few modules that allow users to earn money in your server. With the boost rewarder module, users can earn money bumping the server, with the boost rewarder module, users can earn money daily by boosting the server. With the invites module, users can earn money inviting othe users to your server. There is also a few commands to give money to your users manually.

## :question: How can my users spend money?
You can set a shop and add items to it with the command </shop-add:1213246942776262686>, you can set a price and users can pay for it.

## ${commands} Available commands
- </balance:1201445092129517616> Checks a user money balance.
- </money-add:1201445092129517615> Give money to a user with this command.
- </money-set:1201445092255338577> Sets a user money balance.
- </money-remove:1201445092255338576> Takes / remove money from a user.
- </money-leaderboard:1201445092129517617> Displays the top 10 users with the most money of the guild.
- </shop-add:1213246942776262686> Adds an item to the guild shop.
- </shop-edit:1214377868549955657> Edits an item of the guild shop. 
- </shop-remove:1215206470367313990> Removes an item of the guild shop.
- </shop-setchannel:1215570013394833410> Sets a channel to send a notification when a user buys an item of the guild shop.
- </shop-setwebhook:1215793076409467002> Sets a webhook to send a POST request with a JSON when a user buys an item of the guild shop.

## 🤔 To consider
- The shop does not have an implemented inventory system and therefore is not automatic. You need to set a channel / webhook to know if a user bought an item.
- The webhook is for developers, is not a discord webhook, it is an URL where i will send a POST request to, containing the data of the buyer and the item bought.

## ⚙️ Actual configuration
- Channel ➞ ${guildConfig.shopChannel ? `<#${guildConfig.shopChannel}>` : "None"}
- Webhook ➞ ${guildConfig.shopWebhook ? `${guildConfig.shopWebhook}` : "None"}
`;
};

const interchatHelper = async (interaction) => {
    const guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);
    return `# 🌐 Interchat category

## :question: How it works?
With this module, you have the ability to chat with other Discord servers. To do so, simply join an interchat server using the command </interchat-join:1201445092255338578>. It is 
recommended that your interchat channel is specifically created for interchat purposes and is kept empty of other content.

## ${commands} Available commands
- </interchat-join:1201445092255338578> Joins to an interchat server.
- </interchat-leave:1201445092255338579> Leaves the current interchat server.

## 🤔 To consider
- Discord Embeds have limitations. If your message exceeds those limitations, your message won't be posted.

## ⚙️ Actual configuration
- Channel ➞ ${guildConfig.interchatChannel.id ? `<#${guildConfig.interchatChannel.id}>` : "None"}
- Server ➞ ${guildConfig.interchatChannel.server ? `\`${guildConfig.interchatChannel.server}\`` : "None"}
`;
};

const utilityHelper = async (interaction) => {
    return `# 🧰 Utility category \n\n
## ${commands} Available commands
- </inviteme:1201445092255338585> Invite the Growy Bot to your Discord server.
- </clear:1202746886407196732> Delete messages from a channel.
- </lock:1216251868796289055> Disables @everyone to send messages in specific channel.
- </unlock:1216254790460375092> Allows @everyone to send messages in specific channel.
- </embed:1216618352580100137> Shows a modal to easy create an embed message.
`;
};

module.exports = {
    homeHelper,
    invitesHelper,
    boostRewarderHelper,
    bumpReminderHelper,
    economyHelper,
    interchatHelper,
    utilityHelper,
};
