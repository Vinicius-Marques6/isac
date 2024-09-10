const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('someone')
        .setDescription('Choose a random member from the server to mention')
        .setDescriptionLocalizations({ 'pt-BR': 'Escolha um membro aleatório do servidor para mencionar' }),
    async execute(interaction) {
        const guild = interaction.guild;
        await guild.members.fetch();
        const members = guild.members.cache.filter(member => !member.user.bot);
        const randomMember = members.random();
        
        await interaction.reply({ content: `<@${randomMember.id}>` });
    }
}