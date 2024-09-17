const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emoji')
		.setDescription('Send a emoji!')
        .setDescriptionLocalizations({ 'pt-BR': 'Envie um emoji!' })
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .addStringOption(option =>
            option.setName('name')
            .setDescription('The name of the emoji')
            .setDescriptionLocalizations({ 'pt-BR': 'O nome do emoji' })
            .setRequired(true)
            .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const emojis = await interaction.client.application.emojis.fetch();
        const filtered = emojis.filter(emoji => emoji.name.includes(focusedValue));
        await interaction.respond(
            filtered.map(emoji => ({
                name: emoji.name,
                value: emoji.name,
            }))
        );
    },
	async execute(interaction) {
        const name = interaction.options.getString('name');

        const emoji = interaction.client.application.emojis.cache.find(emoji => emoji.name === name);

        if (!emoji) {
            await interaction.reply({ content: 'Emoji not found!', ephemeral: true });
            return;
        }

		await interaction.reply(`<:${emoji.name}:${emoji.id}>`);
	},
};