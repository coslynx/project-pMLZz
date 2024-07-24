const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  run: async (interaction) => {
    const ping = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! 🏓 Latency: ${ping}ms`);
  },
};