const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban ai đó khỏi máy chủ')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Thằng mà mày muốn ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Lý do ban (tùy chọn)')
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('Bạn đ** có quyền ban.');
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do được cung cấp.';

    try {
      if (!interaction.deferred) {
        await interaction.deferReply();
      }

      await interaction.guild.members.ban(user, { reason: reason });

      const channelId = '1115958935439020092';

      const farewellChannel = interaction.guild.channels.cache.get(channelId);

      await farewellChannel.send(`**${user.tag}** || ID: **${user.id}** đã bị ${interaction.user.toString()} ban khỏi máy chủ`);

      await interaction.editReply(`Đã ban **${user.tag}** || ID: **${user.id}** với lý do: **${reason}**`);
    } catch (error) {
      console.error(error);
      await interaction.editReply('Có lỗi xảy ra khi thực hiện lệnh.');
    }
  },
};
