const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current music queue'),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    const songs = queue.songs.slice(1); // Skip the current song
    if (songs.length === 0) {
      return interaction.reply('The queue is empty!');
    }

    const queueString = songs
      .map((song, index) => `${index + 1}. **${song.title}** by **${song.author}**`)
      .join('\n');

    await interaction.reply(`**Current Queue:**\n${queueString}`);
  },
};