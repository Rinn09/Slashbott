const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Spam tin nhắn')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('Nội dung muốn spam:')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('spam_count')
        .setDescription('Số tin nhắn muốn spam:')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('interval')
        .setDescription('Độ trễ giữa mỗi tin nhắn (ms):')
        .setRequired(true)
    ),
  async execute(interaction) {

    const content = interaction.options.getString('content');

    const spamCount = interaction.options.getInteger('spam_count');

    const interval = interaction.options.getInteger('interval');
  
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply('Đ** phải ai cũng spam được nha cu');
    }
  
    await interaction.deferReply();
  
    for (let i = 0; i < spamCount; i++) {
      await interaction.channel.send(content);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  
    await interaction.editReply(`Đã spam tin nhắn **"${content}"** **${spamCount}** lần, với khoảng thời gian **${interval / 1000}** giây giữa mỗi tin nhắn.`);
  }
};
