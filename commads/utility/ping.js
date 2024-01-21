const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Đo độ trễ của bot'),
	async execute(interaction) {
        const start = Date.now();
		await interaction.reply('Đang đo...');
        const end = Date.now();
        const latency = end - start;
        await interaction.editReply(`Pong! Độ trễ: **${latency}ms**`);
	},
};
