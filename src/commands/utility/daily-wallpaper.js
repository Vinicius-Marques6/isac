const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sendImageOfTheDay = require('../../services/imageOfTheDay');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-wallpaper')
        .setDescription('Send the daily wallpaper')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('region')
            .setDescription('Region to get the wallpaper from')
            .addChoices(
                { name: 'United States', value: 'us' },
                { name: 'Brazil', value: 'br' }
            )),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.channel;

        if (interaction.options.getString('region') === 'br') {
            await sendImageOfTheDay(channel, 'br');
        } else {
            await sendImageOfTheDay(channel);
        }
        await interaction.editReply({ content: 'Sent the daily wallpaper' });
    }
}