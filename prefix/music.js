const { joinVoiceChannel, createAudioResource, createAudioPlayer, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const playDL = require('play-dl');

let connection, player, isPlaying = false;

async function playMusic(message, prefix) {
    try {
        if (!message.member.voice.channel) {
            return message.channel.send('Chưa vào voice thì phát đéo gì? Phát cứt vào mỏ mày hả?');
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        const query = args.join(' ');

        if (connection && connection.state.status !== 'destroyed') {
            if (player && player.state.status === 'playing') {
                player.pause();
            }

            player.removeAllListeners();
            connection.destroy();
        }

        connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const stream = await playDL.stream(query);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });
        player = createAudioPlayer();

        connection.subscribe(player);
        player.play(resource);

        player.on('stateChange', (oldState, newState) => {
            if (newState.status === 'idle') {
                if (connection && connection.state.status !== 'destroyed') {
                    player.removeAllListeners();
                    connection.destroy();
                }
                isPlaying = false;
            }
        });

        isPlaying = true;

        message.channel.send(`Đang phát...`);
    } catch (err) {
        console.error(err);
        message.channel.send('Lỗi khi phát nhạc!');
    }
}

function pause(message) {
    if (player && player.state.status === 'playing') {
        player.pause();
        message.channel.send('Đã tạm dừng...');
    } else {
        message.channel.send('Đá đầu chó mày giờ?');
    }
}

function resume(message) {
    if (player && player.state.status === 'paused') {
        player.unpause();
        message.channel.send('Tiếp tục phát nhạc...');
    } else {
        message.channel.send('Có dừng đ** đâu?');
    }
}

function stop(message) {
    if (player && (player.state.status === 'playing' || player.state.status === 'paused')) {
        player.stop();
        connection.destroy();
        isPlaying = false;
        message.channel.send('Đã dừng phát nhạc.');
    } else {
        message.channel.send('Có phát đ** đâu mà dừng.');
    }
}

module.exports = { playMusic, resume, pause, stop };
