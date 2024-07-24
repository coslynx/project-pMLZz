const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows a list of available commands'),
  run: async (interaction) => {
    const helpMessage = `**Available Commands:**\n${commands.map((command) => `/${command.name} - ${command.description}`).join('\n')}`;

    await interaction.reply(helpMessage);
  },
};