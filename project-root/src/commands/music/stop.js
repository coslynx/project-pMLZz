const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music and clears the queue'),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    musicPlayer.stop(interaction.guild);
    await interaction.reply('Stopped the music and cleared the queue!');
  },
};