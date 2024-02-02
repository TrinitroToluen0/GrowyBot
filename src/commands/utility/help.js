const User = require("../../models/UserModel.js");
const { commands } = require("../../utils/emojis.json");
const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    Colors,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");
const { goldCoin, invitation, nitro } = require("../../utils/emojis.json");

module.exports = {
    category: "utility",
    cooldown: 5,
    botPermissions: [PermissionsBitField.Flags.UseExternalEmojis],
    data: new SlashCommandBuilder().setName("help").setDescription("Shows commands information and how to setup some features.").setDMPermission(false),

    async execute(interaction) {
        let guildConfig = await interaction.client.getGuildConfig(interaction.guild.id);

        let embedDescription = `Do you need help? This is the place!
        
        Start by selecting the category you want to get help for.
        `;

        const embed = new EmbedBuilder().setColor(Colors.Blue).setDescription(embedDescription);
        const categories = [
            {
                label: "Boost rewarder",
                description: "Reward users for being server boosters",
                value: "boostrewarder",
                emoji: nitro,
                embedDescription: `# ${nitro} Boost rewarder category

## :question: How it works?
Every day at 9:00 P.M UTC, all members of your guild with the Discord-created Booster role will receive a specified amount of money. This amount is determined by you in the configuration. Additionally, these rewarded users will be publicly thanked in a designated channel within your guild, which you also need to set up.

## ${commands} Available commands
- </boostrewarder-enable:1201445092129517608> This will enable the boost rewarder module, if the module is disabled, your boosters won't be rewarded.
- </boostrewarder-setchannel:1201445092129517609> This will set a channel for the boost rewarder module to publicly thank all of the boosters in your server.
- </boostrewarder-setreward:1201445092129517610> With this command, you can set the amount of money that your server boosters will get for boosting your server.

## 🤔 To consider
- Your server must have an official booster role created by Discord for this module to properly work.

## ⚙️ Actual configuration
- Enabled ➞ \`${guildConfig.boostRewarderEnabled}\`
- Channel ➞ ${guildConfig.boostRewarderChannel ? `<#${guildConfig.boostRewarderChannel}>` : "None"}
- Reward ➞ ${goldCoin} \`${guildConfig.boostReward}\`
`,
            },
            {
                label: "Bump reminder",
                description: "Remind and reward users for bumping your server. Requires Disboard bot.",
                value: "bumpreminder",
                emoji: "⏰",
                embedDescription: `# ⏰ Bump reminder category

## :question: How it works?
When users bump your server executing the comand </bump:947088344167366698>, a timer will be set and 2 hours later, I will 
remember your users that it's time to bump again. Also, you can specify how much money your users can win for bumping your server.

## :question: What is a "bump"? What is Disboard?
Disboard is a website to grow your Discord server, there you can submit your server and invite the Disboard bot. 
When a user "bumps" your server, it means that they executed the command  </bump:947088344167366698>, which will bump 
your server to the top of the Disboard website, and therefore, you will gain new users, a bump can be done every 2 hours.

## ${commands} Available commands
- **/bumpreminder-enable** This will enable the bump reminder module, if the module is disabled, nothing will happen even if disboard is in your server and a user bumps it.
- **/bumpreminder-setchannel** This will set a channel for the bump reminder module to remind your users when they can bump and publicly thank all of the bumpers in your server.
- **/bumpreminder-setreward** With this command, you can set the amount of money that your bumpers will get for bumping your server.

## 🤔 To consider
- This module requires you to have your server submitted and approved on the [Disboard website](https://disboard.org/).
- This module requires you to have the Disboard bot setup in your server.

## ⚙️ Actual configuration
- Enabled ➞ \`${guildConfig.bumpReminderEnabled}\`
- Channel ➞ ${guildConfig.bumpReminderChannel ? `<#${guildConfig.bumpReminderChannel}>` : "None"}
- Reward ➞ ${goldCoin} \`${guildConfig.bumpReward}\`
`,
            },
            {
                label: "Economy",
                description: "Currency system, set a shop and let users buy items on it.",
                value: "economy",
                emoji: "🏦",
                embedDescription: `Economy category`,
                embedDescription: `# 🏦 Economy category

## :question: How it works?
This is a currency system that allows users to buy items on your guild shop configured by you.

## :question: How can my users earn money?
As you might see, there are a few modules that allow users to earn money on your server, in the boost rewarder module, your
users can earn money bumping the server, with the boost rewarder module, users can earn money daily by boosting the server ,
in the invites module, users can earn money inviting othe users to your server, and there is also a few commands to give money
to your users.

## :question: How can my users spend money?
You can set a shop and add items to it with the command \`/shop-add\`, you can set a price and users can pay for it.
You can sell roles to be automatically assigned to the people who buy it, and you can sell other things an manually
give them to your users.

## ${commands} Available commands
- **/money-add** Give money to a user with this command.
- **/balance** Checks a user’s money balance.
- **/money-leaderboard** Displays the top 10 users with the most money of the guild.
- **/money-remove** Takes / remove money from a user.
- **/money-set** Sets a user money balance.
`,
            },
            {
                label: "Interchat",
                description: "Chat with other discord servers.",
                value: "interchat",
                emoji: "🌐",
                embedDescription: `# 🌐 Interchat category

## :question: How it works?
You can chat with other Discord server with this module, all you have to do is join to an interchat server with the command </interchat-join:1201445092255338578>
I recommend that your interchat channel is empty and created specifically for the interchat.

## ${commands} Available commands
- **/boostrewarder-enable** This will enable the boost rewarder module, if the module is disabled, your boosters won't be rewarded.
- **/boostrewarder-setchannel** This will set a channel for the boost rewarder module to publicly thank all of the boosters in your server.
- **/boostrewarder-setreward** With this command, you can set the amount of money that your server boosters will get for boosting your server.

## 🤔 To consider
- Your server must have an official booster role created by Discord for this module to properly work.

## ⚙️ Actual configuration
- Enabled ➞ \`${guildConfig.boostRewarderEnabled}\`
- Channel ➞ ${guildConfig.boostRewarderChannel ? `<#${guildConfig.boostRewarderChannel}>` : "None"}
- Reward ➞ ${goldCoin} \`${guildConfig.boostReward}\`
`,
            },
            {
                label: "Utility",
                description: "Useful variety commands.",
                value: "utility",
                emoji: "🧰",
                embedDescription: `Utility category`,
            },
        ];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("Select a category...")
            .setMaxValues(1)
            .addOptions(
                categories.map((category) => {
                    return new StringSelectMenuOptionBuilder().setLabel(category.label).setDescription(category.description).setValue(category.value).setEmoji(category.emoji);
                })
            );
        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({ embeds: [embed], components: [row] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
            time: 600_000,
        });

        collector.on("collect", async (i) => {
            i.deferUpdate();
            guildConfig = await interaction.client.getGuildConfig(i.guild.id);
            const selectedValue = i.values[0];
            const selectedCategory = categories.find((category) => category.value === selectedValue);
            if (selectedCategory) {
                embed.setDescription(selectedCategory.embedDescription);
                reply.edit({ embeds: [embed], components: [row] });
            }
        });
        collector.on("end", () => {
            selectMenu.setDisabled(true);
            reply.edit({ embeds: [embed], components: [row] });
        });
    },
};
