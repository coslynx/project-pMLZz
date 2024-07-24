const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins a voice channel'),
  run: async (interaction) => {
    if (!interaction.member.voice.channel) {
      return interaction.reply('You must be in a voice channel to use this command!');
    }

    const queue = musicPlayer.getQueue(interaction.guild);
    if (queue) {
      // If the bot is already in a voice channel, try to move it
      try {
        await queue.voiceChannel.leave();
        await interaction.member.voice.channel.join();
        queue.voiceChannel = interaction.member.voice.channel;
        await interaction.reply(`Moved to your voice channel!`);
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not move to your voice channel!');
      }
    } else {
      // If the bot is not in a voice channel, join it
      try {
        await interaction.member.voice.channel.join();
        await interaction.reply(`Joined your voice channel!`);
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not join your voice channel!');
      }
    }
  },
};