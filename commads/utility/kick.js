const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Đuổi người dùng khỏi máy chủ')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Người dùng mà bạn muốn đuổi')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Lý do đuổi (tùy chọn)')
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply('Bạn đ** có quyền đuổi.');
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do được cung cấp.';
    

    try {
        if (!interaction.deferred) {
            await interaction.deferReply();
          }

      await interaction.guild.members.kick(user, reason);

      const channelId = '1115958935439020092';

      const farewellChannel = interaction.guild.channels.cache.get(channelId);

      await farewellChannel.send(`**${user.tag}** đã bị ${interaction.user.toString()} tống cổ khỏi máy chủ`);

      await interaction.editReply(`Đã đuổi **${user.tag}** với lý do: **${reason}**`);

    } catch (error) {
      console.error(error);
      await interaction.editReply('Có lỗi xảy ra khi thực hiện lệnh.');
    }
  },
};
