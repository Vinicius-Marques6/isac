const { SlashCommandBuilder } = require('discord.js');

const endpoint = "https://cataas.com/cat";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setNameLocalizations({ 'pt-BR': 'gato' })
        .setDescription('Get a random cat image')
        .setDescriptionLocalizations({ 'pt-BR': 'Envie uma imagem de gato aleatória' })
        .addBooleanOption(option =>
            option.setName('gif')
            .setNameLocalizations({ 'pt-BR': 'gif' })
            .setDescription('Get a random cat gif')
            .setDescriptionLocalizations({ 'pt-BR': 'Envie um gif de gato aleatório' })),
    async execute(interaction) {  
        await interaction.deferReply();
        
        const isGif = interaction.options.getBoolean('gif');
        let catURL = endpoint;
        if (isGif) {
            catURL += '/gif';
        }

        await interaction.editReply({ files: [{ attachment: catURL, name: `cat.${isGif ? 'gif' : 'png'}` }] });
    }
}