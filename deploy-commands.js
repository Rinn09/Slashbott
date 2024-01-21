const { REST, Routes } = require('discord.js');

const { clientId, guildId, token } = require('./config.json');

const fs = require('node:fs');

const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);

	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {

		const filePath = path.join(commandsPath, file);

		const command = require(filePath);

		if ('data' in command && 'execute' in command) {

			commands.push(command.data.toJSON());

		} else {

			console.log(`[WARNING] Có 1 lệnh tại ${filePath} bị thiếu thuộc tính bắt buộc: "data" hoặc "execute".`);

		}
	}
}

const rest = new REST().setToken(token);

(async () => {

	try {

		console.log(`Đang load lại ${commands.length} lệnh (/).`);

		const data = await rest.put(

			Routes.applicationGuildCommands(clientId, guildId),

			{ body: commands },

		);

		console.log(`Đã load xong ${data.length} lệnh (/).`);

	} catch (error) {

		console.error(error);

	}
})();
