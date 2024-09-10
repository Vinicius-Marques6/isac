const { SlashCommandBuilder } = require('discord.js');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('node:path');

const FRAMES = 10;

const options = {
    resolution: 128,
    delay: 20,
}

const petGifCache = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pet')
        .setNameLocalizations({ 'pt-BR': 'cafuné' })
        .setDescription('Pet someone')
        .setDescriptionLocalizations({ 'pt-BR': 'Faça cafuné em alguém 🫳' })
        .addUserOption(option =>
            option.setName('user')
            .setNameLocalizations({ 'pt-BR': 'usuário' })
            .setDescription('User to pet')
            .setDescriptionLocalizations({ 'pt-BR': 'Usuário para fazer cafuné' })
            .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        if (!user) {
            return await interaction.reply({ content: 'Please specify a user to pet', ephemeral: true });
        }
        
        const encoder = new GIFEncoder(options.resolution, options.resolution);

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(options.delay);
        encoder.setTransparent();

        const canvas = Canvas.createCanvas(options.resolution, options.resolution);
        const ctx = canvas.getContext('2d');

        const avatar = await Canvas.loadImage(user.avatarURL({ extension: 'png' }));

        for (let i = 0; i < FRAMES; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const j = i < FRAMES / 2 ? i : FRAMES - i;

            const width = 0.8 + j * 0.02;
            const height = 0.8 - j * 0.05;
            const offsetX = (1 - width) * 0.5 + 0.1;
            const offsetY = (1 - height) - 0.08;

            if (i == petGifCache.length) petGifCache.push(await Canvas.loadImage(path.resolve(__dirname, `../../assets/pet/pet${i}.gif`)));

            ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
            ctx.drawImage(petGifCache[i], 0, 0, options.resolution, options.resolution);

            encoder.addFrame(ctx);
        }

        encoder.finish();
        await interaction.reply({ files: [{ attachment: encoder.out.getData(), name: 'pet.gif' }] });
    }
}