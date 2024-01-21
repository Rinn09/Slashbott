const Discord = require('discord.js');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const prefixModule = require('./prefix/prefix');
const musicModule = require('./prefix/music');
const { token, clientId, guildId, welcomeChannelId, mongoosedbURI, testChannel } = require('./config.json');
const userStats = require('./userStats');
const prefix = '%';
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(mongoosedbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("đã kết nối với database");
  } catch (error) {
    console.log(`error: ${error}`);
  }
})();

const client = new Discord.Client({
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
	intents: [
		GatewayIntentBits.Guilds,
		"Guilds",
		"GuildMessages",
		"GuildMembers",
		"GuildMessageReactions",
		"MessageContent",
		"GuildMessageTyping",
		"DirectMessageReactions",
		"DirectMessageTyping",
		"DirectMessages",
		"GuildWebhooks",
		"GuildIntegrations",
		"GuildVoiceStates",
		"GuildBans",
		"GuildPresences",

	]

});

client.on('ready', async () => {
  console.log('Đã bật bot');
  client.guilds.cache.forEach(async (guild) => {
    guild.members.cache.forEach(async (member) => {
      if (!member.user.bot) {
        const userId = member.user.id;
        await updateLevel(userId);
      }
    });
  });
});

client.commands = new Collection();

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);

	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {

		const filePath = path.join(commandsPath, file);

		const command = require(filePath);

		if ('data' in command && 'execute' in command) {

			client.commands.set(command.data.name, command);

		} else {

			console.log(`[WARNING] Có 1 lệnh tại ${filePath} bị thiếu thuộc tính bắt buộc: "data" hoặc "execute".`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Không tìm thấy lệnh nào khớp với ${interaction.commandName}.`);

		return;
	}

	try{

		await command.execute(interaction);

	} catch (error) {

		console.error(error);

		if (interaction.replied || interaction.deferred) {

			await interaction.followUp({ content: 'Có lỗi xảy ra khi thực hiện(executing) lệnh này!', ephemeral: true });

		} else{

			await interaction.reply({ content: 'Có lỗi xảy ra khi thực hiện (executing) lệnh này!', ephemeral: true });
		}
	}
});

client.on('messageCreate', async message => {	
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args[0].toLowerCase();
    
    if (command === 'test') {
        message.channel.send('ok!');
    }

    if (args.includes('anh') && args.includes('iu') && args.includes('em')) {
        prefixModule.yeu(message, prefix);
    }	
    
    if (command === 'play' || command === 'pl') {
        musicModule.playMusic(message, prefix);
    }

    if (command === 'pause' || command === 'p') {
        musicModule.pause(message);
    }

    if (command === 'resume' || command === 'r') {
        musicModule.resume(message);	
    }

	if (command === 'stop' || command === 'st') {
        musicModule.stop(message);	
    }
	
});

client.on(Events.MessageCreate, async message => {
  if (!message.author.bot) {
      const userId = message.author.id;
      userStats.userMessages[userId] = (userStats.userMessages[userId] || 0) + 1;
      updateExp(userId);
      updateLevel(userId, message);
      updateCash(userId);
  }
});

  // Hàm cập nhật EXP
  async function updateExp(userId) {
    const expPerMessage = 10; // Điều chỉnh theo nhu cầu của bạn
    userStats.userExp[userId] = (userStats.userExp[userId] || 0) + expPerMessage;
}

// Hàm cập nhật cấp độ
async function updateLevel(userId, message = null) {
    // Kiểm tra xem message có giá trị không và có gửi từ server không
    if (message && message.guild) {
        // Lấy cấp độ hiện tại của người dùng từ dữ liệu userStats
        const stats = await userStats.getUserStats(userId);
        const currentLevel = stats.userLevels || 0;

        // Lấy số lượng tin nhắn của người dùng từ dữ liệu userMessages
        const messages = userStats.userMessages[userId] || 0;

        // Số lượng EXP cần để tăng một cấp độ, tính theo công thức tăng 35% mỗi cấp độ
        const expPerLevel = Math.floor(10 * Math.pow(1.35, currentLevel));

        // Tính cấp độ mới dựa trên số lượng tin nhắn và số lượng EXP cần
        const newLevel = Math.floor(messages / expPerLevel);

        // Hiển thị thông tin trong console về cấp độ, số lượng tin nhắn, và cấp độ mới
        console.log(`User ${userId} - Current Level: ${currentLevel}, Messages: ${messages}, New Level: ${newLevel}`);

        // Kiểm tra nếu cấp độ mới lớn hơn cấp độ hiện tại
        if (newLevel > currentLevel) {
            // Cập nhật cấp độ mới cho người dùng
            stats.userLevels = newLevel;

            // Cập nhật tiền khi lên level mới
            await updateCash(userId);

            // Lấy channel để gửi thông báo cấp độ mới
            const channel = message.guild.channels.cache.get(testChannel);
            if (channel) {
                // Gửi thông báo chúc mừng cấp độ mới
                channel.send(`Chúc mừng <@${userId}>, đã đạt cấp độ **${newLevel}**!`);
            }
        }
    }
}
  // Hàm cập nhật tiền
  async function updateCash(userId) {
    const stats = await userStats.getUserStats(userId);
    const currentLevel = stats.userLevels || 0;
    stats.userCash = stats.userCash || 0;

    // Khởi tạo lastLevel nếu chưa tồn tại
    userStats.lastLevel[userId] = userStats.lastLevel[userId] || 0;

    // Kiểm tra xem có lên level không
    if (currentLevel > userStats.lastLevel[userId]) {
        // Mỗi lần lên level, cộng thêm 100$ và tăng 20%
        const levelBonusBase = 100; // Số tiền cộng cơ bản khi lên level
        const bonusPercentage = 0.2; // Tăng 20% mỗi lần lên level

        // Tính mức thưởng cấp độ
        const levelBonus = levelBonusBase * Math.pow(1 + bonusPercentage, currentLevel);

        // Cộng tiền cấp độ mới cho người dùng
        stats.userCash += levelBonus;

        // Lưu lại cấp độ cuối cùng
        userStats.lastLevel[userId] = currentLevel;

        // Cập nhật thông tin người dùng trong cơ sở dữ liệu
        await userStats.updateUserStats(stats);
    }
}
  
  
client.login(token);