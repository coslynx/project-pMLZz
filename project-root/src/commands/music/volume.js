const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjusts the volume of the music')
    .addIntegerOption((option) =>
      option
        .setName('volume')
        .setDescription('The volume level (0-100)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    const volume = interaction.options.getInteger('volume');

    queue.setVolume(volume / 100);

    await interaction.reply(`Volume set to ${volume}%`);
  },
};