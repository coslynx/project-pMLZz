const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the voice channel'),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    try {
      await queue.voiceChannel.leave();
      await interaction.reply('Left the voice channel!');
      musicPlayer.stop(interaction.guild); // Stop the music and clear the queue
    } catch (error) {
      console.error(error);
      return interaction.reply('Could not leave the voice channel!');
    }
  },
};