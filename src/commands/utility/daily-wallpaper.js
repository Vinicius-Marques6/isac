const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sendImageOfTheDay = require('../../services/imageOfTheDay');
const Guild = require('../../database/schema/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-wallpaper')
        .setDescription('Send the daily wallpaper')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
            .setName('setup')
            .setDescription('Set up this channel to receive the daily wallpaper'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('send')
            .setDescription('Send the daily wallpaper')
            .addStringOption(option =>
                option.setName('region')
                .setDescription('Region to get the wallpaper from')
                .addChoices(
                    { name: 'United States', value: 'us' },
                    { name: 'Brazil', value: 'br' }
                ))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'setup') {
            await interaction.deferReply({ ephemeral: true });

            const guild = await Guild.findByIdAndUpdate(interaction.guild.id, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

            guild.wallpaper_channel = interaction.channel.id;

            await guild.save();

            await interaction.editReply({ content: 'This channel is now set up to receive the daily wallpaper' });
        } else if (interaction.options.getSubcommand() === 'send') {
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
}