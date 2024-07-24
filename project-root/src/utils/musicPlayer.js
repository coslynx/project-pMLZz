const { handleError } = require('./errorHandler');
const ytdl = require('ytdl-core');
const { getYouTubeVideoInfo } = require('./youtube');
const { getTrackFromURL as getSpotifyTrackFromURL } = require('./spotify');
const { getTrackFromURL as getSoundCloudTrackFromURL } = require('./soundcloud');
const { getLyrics } = require('./lyrics');
const { join } = require('path');
const { createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');

const queues = new Map();

/**
 * Gets the queue for a guild.
 * @param {Guild} guild The guild to get the queue for.
 * @returns {Queue} The queue for the guild, or null if none exists.
 */
const getQueue = (guild) => queues.get(guild.id);

/**
 * Creates a new queue for a guild.
 * @param {Guild} guild The guild to create the queue for.
 * @param {VoiceChannel} voiceChannel The voice channel to play music in.
 * @returns {Queue} The newly created queue.
 */
const createQueue = (guild, voiceChannel) => {
  const queue = new Queue(guild, voiceChannel);
  queues.set(guild.id, queue);
  return queue;
};

/**
 * Plays the next song in the queue.
 * @param {Guild} guild The guild to play the song in.
 */
const play = (guild) => {
  const queue = getQueue(guild);
  if (!queue) return;

  if (queue.songs.length === 0) {
    queue.voiceChannel.leave();
    queues.delete(guild.id);
    return;
  }

  queue.current = queue.songs[0];
  queue.songs.shift();

  if (queue.current.source === 'youtube') {
    queue.player = createAudioPlayer();
    queue.resource = createAudioResource(queue.current.stream, {
      inputType: StreamType.Opus,
    });
    queue.player.play(queue.resource);
    queue.connection = joinVoiceChannel({
      channelId: queue.voiceChannel.id,
      guildId: queue.guild.id,
      adapterCreator: queue.guild.voiceAdapterCreator,
    });
    queue.connection.subscribe(queue.player);
    queue.playing = true;
    queue.voiceChannel.guild.channels.cache.get(queue.voiceChannel.id).send(
      `Now playing: **${queue.current.title}** by **${queue.current.author}**`
    );
    queue.player.on('finish', () => {
      queue.playing = false;
      play(queue.guild);
    });
    queue.player.on('error', (error) => {
      handleError(error, 'musicPlayer.play');
      queue.playing = false;
      play(queue.guild);
    });
  } else if (queue.current.source === 'spotify') {
    // Implement Spotify playback logic
  } else if (queue.current.source === 'soundcloud') {
    // Implement SoundCloud playback logic
  }
};

/**
 * Adds a song to the queue.
 * @param {Guild} guild The guild to add the song to.
 * @param {Object} song The song object to add.
 */
const add = (guild, song) => {
  const queue = getQueue(guild);
  if (!queue) {
    return;
  }
  queue.songs.push(song);
};

/**
 * Skips the current song.
 * @param {Guild} guild The guild to skip the song in.
 */
const skip = (guild) => {
  const queue = getQueue(guild);
  if (!queue) {
    return;
  }
  queue.player.stop();
};

/**
 * Stops the music and clears the queue.
 * @param {Guild} guild The guild to stop the music in.
 */
const stop = (guild) => {
  const queue = getQueue(guild);
  if (!queue) {
    return;
  }
  queue.player.stop();
  queue.songs = [];
  queue.voiceChannel.leave();
  queues.delete(guild.id);
};

class Queue {
  constructor(guild, voiceChannel) {
    this.guild = guild;
    this.voiceChannel = voiceChannel;
    this.songs = [];
    this.current = null;
    this.playing = false;
    this.connection = null;
    this.player = null;
    this.resource = null;
    this.volume = 1;
    this.repeatMode = 0; // 0: off, 1: song, 2: queue
  }

  /**
   * Adds a song to the queue.
   * @param {Object} song The song object to add.
   */
  add(song) {
    this.songs.push(song);
  }

  /**
   * Sets the volume of the music playback.
   * @param {number} volume The volume level (0-1).
   */
  setVolume(volume) {
    this.volume = volume;
    if (this.player) {
      this.player.volume = volume;
    }
  }

  /**
   * Sets the repeat mode.
   * @param {number} repeatMode The repeat mode (0: off, 1: song, 2: queue).
   */
  setRepeatMode(repeatMode) {
    this.repeatMode = repeatMode;
  }

  /**
   * Shuffles the queue.
   */
  shuffle() {
    for (let i = this.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
  }

  /**
   * Plays the current song.
   */
  play() {
    if (this.player && this.player.state.status === 'paused') {
      this.player.unpause();
      this.playing = true;
    }
  }

  /**
   * Pauses the current song.
   */
  pause() {
    if (this.player && this.player.state.status === 'playing') {
      this.player.pause();
      this.playing = false;
    }
  }

  /**
   * Gets the duration of the current song in a formatted string.
   * @returns {string} The formatted duration of the current song.
   */
  getFormattedDuration() {
    if (!this.current || !this.current.duration) return '0:00';

    const minutes = Math.floor(this.current.duration / 60);
    const seconds = Math.floor(this.current.duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Gets the progress of the current song in a formatted string.
   * @returns {string} The formatted progress of the current song.
   */
  getFormattedProgress() {
    if (!this.current || !this.player || !this.player.state.playbackDuration) return '0:00';

    const minutes = Math.floor(this.player.state.playbackDuration / 60000);
    const seconds = Math.floor((this.player.state.playbackDuration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Gets the lyrics for the current song.
   * @returns {Promise<string>} A promise that resolves to the lyrics of the current song.
   */
  async getLyrics() {
    if (!this.current) {
      return 'No song is currently playing.';
    }
    return getLyrics(this.current.title, this.current.author);
  }
}

module.exports = {
  getQueue,
  createQueue,
  play,
  add,
  skip,
  stop,
};