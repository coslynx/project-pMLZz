const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../../utils/musicPlayer');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const spotify = require('../../utils/spotify');
const soundcloud = require('../../utils/soundcloud');
const { youtubeApiKey } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const { token } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays music from YouTube, Spotify, or SoundCloud')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The song or playlist to play')
        .setRequired(true)
    ),
  run: async (interaction) => {
    const query = interaction.options.getString('query');

    if (!interaction.member.voice.channel) {
      return interaction.reply('You must be in a voice channel to play music!');
    }

    const queue = musicPlayer.getQueue(interaction.guild);

    if (!queue) {
      // If there's no queue, create a new one
      try {
        await interaction.member.voice.channel.join();
        musicPlayer.createQueue(interaction.guild, interaction.member.voice.channel);
        await interaction.reply('Joined your voice channel!');
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not join your voice channel!');
      }
    }

    // Check if the query is a YouTube link
    if (ytdl.validateURL(query)) {
      try {
        const info = await ytdl.getInfo(query);
        const song = {
          title: info.videoDetails.title,
          author: info.videoDetails.author.name,
          url: query,
          duration: info.videoDetails.lengthSeconds,
          source: 'youtube',
          stream: ytdl(query, { filter: 'audioonly', quality: 'highestaudio' }),
        };
        queue.add(song);
        await interaction.reply(`Added **${song.title}** to the queue!`);

        // Start playing if the queue is empty
        if (!queue.playing) {
          musicPlayer.play(interaction.guild);
        }
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not play that song!');
      }
    } else if (query.includes('spotify.com')) {
      // Check if the query is a Spotify link
      try {
        const spotifyTrack = await spotify.getTrackFromURL(query);
        const song = {
          title: spotifyTrack.name,
          author: spotifyTrack.artists[0].name,
          url: spotifyTrack.external_urls.spotify,
          duration: spotifyTrack.duration_ms / 1000, // Convert milliseconds to seconds
          source: 'spotify',
          stream: null,
        };
        queue.add(song);
        await interaction.reply(`Added **${song.title}** to the queue!`);

        // Start playing if the queue is empty
        if (!queue.playing) {
          musicPlayer.play(interaction.guild);
        }
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not play that song!');
      }
    } else if (query.includes('soundcloud.com')) {
      // Check if the query is a SoundCloud link
      try {
        const soundcloudTrack = await soundcloud.getTrackFromURL(query);
        const song = {
          title: soundcloudTrack.title,
          author: soundcloudTrack.user.username,
          url: query,
          duration: soundcloudTrack.duration / 1000, // Convert milliseconds to seconds
          source: 'soundcloud',
          stream: null,
        };
        queue.add(song);
        await interaction.reply(`Added **${song.title}** to the queue!`);

        // Start playing if the queue is empty
        if (!queue.playing) {
          musicPlayer.play(interaction.guild);
        }
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not play that song!');
      }
    } else {
      // If the query is not a link, search for it on YouTube
      try {
        const searchResults = await ytsr(query, { limit: 1, key: youtubeApiKey });
        const firstResult = searchResults.items[0];
        const song = {
          title: firstResult.title,
          author: firstResult.author.name,
          url: firstResult.url,
          duration: firstResult.duration,
          source: 'youtube',
          stream: ytdl(firstResult.url, { filter: 'audioonly', quality: 'highestaudio' }),
        };
        queue.add(song);
        await interaction.reply(`Added **${song.title}** to the queue!`);

        // Start playing if the queue is empty
        if (!queue.playing) {
          musicPlayer.play(interaction.guild);
        }
      } catch (error) {
        console.error(error);
        return interaction.reply('Could not find that song!');
      }
    }
  },
};