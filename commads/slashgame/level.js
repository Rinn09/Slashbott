const { SlashCommandBuilder } = require('@discordjs/builders');
const UserStat = require('../../models/UserStat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Kiểm tra cấp độ, EXP và tiền của bạn.'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const stats = await UserStat.findOne({ userId: userId });

            if (!stats) {
                // Nếu không có dữ liệu người dùng, bạn có thể thực hiện xử lý tại đây
                await interaction.reply({ content: 'Không tìm thấy thông tin người dùng.', ephemeral: true });
                return;
            }

            const currentLevel = stats.userLevels || 0;
            const currentEXP = stats.userExp || 0;
            const currentCash = stats.userCash || 0;
            const formattedCash = currentCash.toFixed(2);

            await interaction.reply(`Bạn đang ở cấp độ ${currentLevel} với ${currentEXP} EXP và có ${formattedCash}$.`);

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Có lỗi xảy ra khi thực hiện lệnh này!', ephemeral: true });
        }
    },
};
