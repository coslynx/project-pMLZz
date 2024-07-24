const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  run: async (interaction) => {
    const queue = musicPlayer.getQueue(interaction.guild);
    if (!queue) {
      return interaction.reply('There is no music playing in this server!');
    }

    musicPlayer.skip(interaction.guild);
    await interaction.reply('Skipped to the next song!');
  },
};