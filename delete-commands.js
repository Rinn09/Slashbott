const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST().setToken(token);

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1197044421653446756'))
	.then(() => console.log('Xóa lệnh thành công (guild)'))
	.catch(console.error);

/*rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1189513334450565162'))
	.then(() => console.log('Xóa lệnh thành công (guild)'))
	.catch(console.error);
 for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Xóa lệnh thành công (application)'))
	.catch(console.error);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Xóa tất cả các lệnh thành công (guild).'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Xóa tất cả các lệnh thành công (application).'))
	.catch(console.error);
	*/
