const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Gỡ ban')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('ID người dùng mà bạn muốn unban')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('Bạn đ** có unban.');
    }

    const userId = interaction.options.getString('user');

    try {
      if (!interaction.deferred) {
        await interaction.deferReply();
      }

      const bannedUsers = await interaction.guild.bans.fetch();
      const bannedUser = bannedUsers.find(user => user.user.id === userId);

      if (!bannedUser) {
        return interaction.editReply('Người dùng này không có trong danh sách cấm.');
      }

      await interaction.guild.bans.remove(bannedUser.user);

      const channelId = '1115958935439020092';

      const unbanChannel = interaction.guild.channels.cache.get(channelId);

      await unbanChannel.send(`**${bannedUser.user.tag}** đã được ${interaction.user.toString()} unban`);

      await interaction.editReply(`**${bannedUser.user.tag}** đã được unban`);
    } catch (error) {
      console.error(error);
      await interaction.editReply('Có lỗi xảy ra khi thực hiện lệnh.');
    }
  },
};

