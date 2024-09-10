const { Events } = require('discord.js');
require('dotenv').config();


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // change to algo accept the word "oie"
        if (message.content.match(/o+i+e*\s*(isac|<@1116882771827236954>)/gi)) {
            await message.reply(`Oi ${message.author.displayName} 😼`);
        } else if (message.content.match(/t+ch+au+\s*(isac|<@1116882771827236954>)/gi)) {
            await message.reply(`Tchau ${message.author.displayName} :wave:`);
        }

        if (message.channelId === process.env.TWITTER_CHANNEL_ID) {
            ['❤️', '🔁', '💬'].forEach(async emoji => await message.react(emoji));
        }
    }
};