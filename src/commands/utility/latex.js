const { AttachmentBuilder, ContextMenuCommandBuilder, ApplicationCommandType, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: [
        new ContextMenuCommandBuilder()
        .setName('Latex')
        .setType(ApplicationCommandType.Message)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
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

        const image = await loadImage(`https://latex.codecogs.com/png.image?\\large\\dpi{300}\\fg{white}${text}`);
        
        // create a canvas based on the image size
        const canvas = createCanvas(image.width + 100, image.height + 50);
        const ctx = canvas.getContext('2d');

        // Draw the background
        // ctx.fillStyle = '#ffffff';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw image in the center
        ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);


        await interaction.reply({ files: [new AttachmentBuilder(canvas.toBuffer(), 'latex.png')] });
    }
}