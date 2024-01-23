const checkBotPermissions = require("../../helpers/checkBotPermissions.js");
const rewardBoosters = require("../../helpers/rewardBoosters.js");
const sendMessage = require("../../helpers/sendMessage.js");
const { faker } = require("@faker-js/faker");
const User = require("../../models/UserModel.js");
const logger = require("../../utils/logger.js");
const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "test",
    cooldown: 5,
    data: new SlashCommandBuilder().setName("test").setDescription("test").setDMPermission(false).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        // rewardBoosters(interaction.client);
        await interaction.deferReply();

        // Primera parte: Elimina todos los usuarios existentes y crea un perfil de usuario para cada miembro
        await User.deleteMany({ guildId: interaction.guild.id });
        const members = await interaction.guild.members.fetch();
        const memberIds = members.map((member) => member.user.id);

        for (let i = 0; i < memberIds.length; i++) {
            const userId = memberIds[i];

            // Genera una cantidad de dinero aleatoria entre 0 y 1000
            const money = faker.number.int({ min: 0, max: 1000 });

            const user = new User({
                userId: userId,
                guildId: interaction.guild.id,
                money: money,
            });

            // Guarda el usuario en la base de datos
            await user.save();
        }

        // Segunda parte: Asigna un inviterId a cada usuario
        const users = await User.find({ guildId: interaction.guild.id });
        for (let user of users) {
            user.inviterId = faker.helpers.arrayElement(memberIds);
            await user.save();
        }

        // Tercera parte: Cuenta las invitaciones para cada usuario
        for (let user of users) {
            user.invitations = await User.countDocuments({ inviterId: user.userId });
            await user.save();
        }
        interaction.editReply("Done!");
    },
};
