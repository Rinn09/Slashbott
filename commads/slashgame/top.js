const { Client, SlashCommandBuilder } = require('discord.js');
const UserStat = require('../../models/UserStat');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Hiển thị xếp hạng người dùng theo EXP.'),

  async execute(interaction) {
    try {
      const topUsers = await UserStat.find({}).sort({ userExp: -1 }).limit(10);

      const embed = {
        title: 'Top 10 Người Dùng Theo EXP',
        color: 0xFF0099,
        fields: [],
      };

      topUsers.forEach((user, index) => {
        const member = interaction.guild.members.cache.get(user.userId);
        if (member) {
          embed.fields.push({
            name: `${index + 1}. ${member.user.username}`,
            value: `Level: ${user.userLevels || 0}, EXP: ${user.userExp || 0}`,
          });
        }
      });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error executing top command:', error);
      interaction.reply('Có lỗi xảy ra khi lấy thông tin xếp hạng.');
    }
  },
};
