const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the music queue'),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    queue.shuffle();
    await interaction.reply('Shuffled the queue!');
  },
};