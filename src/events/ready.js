const { Events, ActivityType } = require('discord.js');
const sendImageOfTheDay = require('../services/imageOfTheDay');
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        client.user.setActivity({ name: 'Oi jun', type: ActivityType.Custom });
        client.user.setUsername("Isac");

        console.log(`Ready! Logged in as ${client.user.tag}`);

        setInterval(async () => {
            const date = new Date();
            //console.log(`Current time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            if (date.getHours() === 7 && date.getMinutes() == 15 && date.getSeconds() == 0){
                console.log('Sending image of the day');
                const channel = client.channels.cache.get(process.env.WALLPAPER_CHANNEL_ID);
                sendImageOfTheDay(channel);
            }
        }, 1000)
	},
};