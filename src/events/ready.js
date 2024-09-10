const { Events, ActivityType } = require('discord.js');
const sendImageOfTheDay = require('../services/imageOfTheDay');
const Guild = require('../database/schema/guild');
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
                const channels = await Guild.find({ wallpaper_channel: { $ne: null } });
                sendImageOfTheDay(channels);
            }
        }, 1000)
	},
};