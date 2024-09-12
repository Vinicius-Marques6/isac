const { SlashCommandBuilder, AttachmentBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ApplicationIntegrationType } = require('discord.js');
const { createCanvas } = require('canvas');

const options = {
    resolution: 500,
}

module.exports = {
    data: [
        new ContextMenuCommandBuilder()
        .setName('Brat')
        .setType(ApplicationCommandType.Message)
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),

        new SlashCommandBuilder()
        .setName('brat')
        .setNameLocalizations({ 'pt-BR': 'brat' })
        .setDescription('Create your Brat album')
        .setDescriptionLocalizations({ 'pt-BR': 'Crie seu albúm Brat' })
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Text to put in the album')
            .setNameLocalizations({ 'pt-BR': 'texto' })
            .setDescriptionLocalizations({ 'pt-BR': 'Texto para colocar no albúm' })
            .setRequired(true))
    ],
    async execute(interaction) {
        let text;
        // Check if the interaction is a context menu command or a slash command
        if (interaction.isContextMenuCommand()) {
            text = interaction.targetMessage.cleanContent;
        } else {
            text = interaction.options.getString('text');
        }

        if (!text) {
            return await interaction.reply({ content: 'Please specify a text', ephemeral: true });
        }
        
        const canvas = createCanvas(options.resolution, options.resolution);
        const ctx = canvas.getContext('2d');

        // Draw the background
        ctx.fillStyle = '#8ccf22';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the text
        ctx.fillStyle = '#000000';
        ctx.font = '160px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.scale(.5, 1);

        let textSize = ctx.measureText(text);
        let maxWidth = canvas.width - 20;
        // Check if the text is bigger than the canvas
        if (textSize.width > maxWidth) {
            let scaleFactor = maxWidth / textSize.width;
            ctx.font = `${parseInt(ctx.font) * scaleFactor}px sans-serif`;
        }
        ctx.fillText(text, canvas.width, canvas.height / 2);

        await interaction.reply({ files: [new AttachmentBuilder(canvas.toBuffer(), 'brat.png')] });
    }
}