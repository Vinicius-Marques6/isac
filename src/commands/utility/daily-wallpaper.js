const { SlashCommandBuilder } = require('discord.js');
const imageOfTheDay = require('../../services/imageOfTheDay');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-wallpaper')
        .setDescription('Send the daily wallpaper')
        .addStringOption(option =>
            option.setName('region')
            .setDescription('Region to get the wallpaper from')
            .addChoices(
                { name: 'United States', value: 'us' },
                { name: 'Brazil', value: 'br' }
            )),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const webhooks = await interaction.channel.fetchWebhooks();
        const webhook = webhooks.first();
        if (!webhook) {
            return await interaction.editReply({ content: 'No webhooks found in this channel'});
        }
        if (interaction.options.getString('region') === 'br') {
            imageOfTheDay(webhook, 'br');
        } else {
            await imageOfTheDay(webhook);
        }
        await interaction.editReply({ content: 'Sent the daily wallpaper' });
    }
}