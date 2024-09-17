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
            .setRequired(true)
            .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const emojis = await interaction.client.application.emojis.fetch();
        const filtered = emojis.filter(emoji => emoji.name.includes(focusedValue));
        await interaction.respond(
            filtered.map(emoji => ({
                name: emoji.name,
                value: `<:${emoji.name}:${emoji.id}>`,
            }))
        );
    },
	async execute(interaction) {
        const name = interaction.options.getString('name');
		await interaction.reply(name);
	},
};