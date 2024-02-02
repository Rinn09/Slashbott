const { SlashCommandBuilder } = require('@discordjs/builders');
const UserStat = require('../../models/UserStat');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetuser')
    .setDescription('Reset EXP, level, và tiền của người dùng.')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (!user) {
      return interaction.reply('Không hợp lệ!');
    }

    try {
      let stats = await UserStat.findOne({ userId: user.id });

      if (!stats) {
        return interaction.reply('Không tìm thấy người dùng!');
      }

      stats.userExp = 0;
      stats.userLevels = 0;
      stats.userCash = 0;

      await stats.save();

      return interaction.reply(`Đã reset EXP, level, và tiền của **${user.tag}**.`);
    } catch (error) {
      console.error('Error resetting user:', error);
      return interaction.reply('Đã xảy ra lỗi khi reset người dùng.');
    }
  },
};
