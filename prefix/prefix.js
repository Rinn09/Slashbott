function yeu(message, prefix) {
    if (message.content.includes('anh') && message.content.includes('iu') && message.content.includes('em')) {
        if (message.author.id === '953837159192879104') {
            message.channel.send('em cũng iu anh hehe');
        } else if (message.author.id === '791679378534694942') {
            message.channel.send('Bà bị less hả?');
        } else {
            message.channel.send('cút mẹ mày đi ranh con');
        }
    }
}
module.exports = { yeu };
