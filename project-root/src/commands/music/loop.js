const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loops the current song or the entire queue')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('The loop mode')
        .setRequired(true)
        .addChoices(
          { name: 'song', value: 'song' },
          { name: 'queue', value: 'queue' }
        )
    ),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    const loopMode = interaction.options.getString('mode');

    if (loopMode === 'song') {
      queue.setRepeatMode(1);
      await interaction.reply('Looping the current song!');
    } else if (loopMode === 'queue') {
      queue.setRepeatMode(2);
      await interaction.reply('Looping the entire queue!');
    }
  },
};