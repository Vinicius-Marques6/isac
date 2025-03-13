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
        .addStringOption(option =>
            option.setName('alignment')
            .setDescription('Text alignment')
            .setNameLocalizations({ 'pt-BR': 'alinhamento' })
            .setDescriptionLocalizations({ 'pt-BR': 'Alinhamento do texto' })
            .addChoices(
                { name: 'Left', value: 'left' },
                { name: 'Center', value: 'center' },
                { name: 'Right', value: 'right' },
                { name: 'Justify', value: 'justify' }
            ))
        .addBooleanOption(option =>
            option.setName('reverse')
            .setDescription('Reverse the text')
            .setNameLocalizations({ 'pt-BR': 'reverter' })
            .setDescriptionLocalizations({ 'pt-BR': 'Reverter o texto' }))
    ],
    async execute(interaction) {
        let text;
        let alignment = 'center';
        let reverse = interaction.options.getBoolean('reverse');
        // Check if the interaction is a context menu command or a slash command
        if (interaction.isContextMenuCommand()) {
            text = interaction.targetMessage;
        } else {
            text = interaction.options.getString('text');
            alignment = interaction.options.getString('alignment') || 'center';
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
        ctx.textAlign = alignment;
        ctx.textBaseline = 'middle';
        ctx.scale(.5, 1);

        let textSize = ctx.measureText(text);
        let maxWidth = canvas.width - 20;
        // Check if the text is bigger than the canvas
        if (alignment !== 'justify' && textSize.width > maxWidth) {
            let scaleFactor = maxWidth / textSize.width;
            ctx.font = `${parseInt(ctx.font) * scaleFactor}px sans-serif`;
        }

        if (alignment === 'center') {
            ctx.fillText(text, canvas.width, canvas.height / 2);
        } else if (alignment === 'right') {
            ctx.fillText(text, (canvas.width * 2) - 10, canvas.height / 2);
        } else if (alignment === 'left') {
            ctx.fillText(text, 10, canvas.height / 2);
        } else if (alignment === 'justify') {
            ctx.font = '130px sans-serif';
            ctx.textBaseline = 'baseline';
            // printAtWordWrap(ctx, text, 20, 50, 95, canvas.width * 2 - 40, 5, reverse);
            drawJustifiedText(ctx, text, 20, 50, canvas.width * 2 - 40, 100);
        }

        await interaction.reply({ files: [new AttachmentBuilder(canvas.toBuffer(), 'brat.png')] });
    }
}

function fillTextBlock(ctx, text, x, y, width, height, options) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function getLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
}

function drawJustifiedText(ctx, text, x, y, maxWidth, lineHeight) {
    const lines = getLines(ctx, text, maxWidth);
    
    lines.forEach((line, index) => {
      const words = line.match(/(\S+\s*)/g) || [];
      const lineWidth = ctx.measureText(line).width;
      const spaceWidth = (maxWidth - lineWidth) / (words.length - 1); // Espaçamento entre as palavras

      let currentX = x;

      words.forEach((word, i) => {
        ctx.fillText(word.trim(), currentX, y + (index * lineHeight));
        if (i < words.length - 1) {
          currentX += ctx.measureText(word).width + spaceWidth; // Avançar a posição com o espaçamento
        }
      });
    });
}