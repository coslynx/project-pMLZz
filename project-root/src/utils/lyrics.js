const { geniusApiToken } = require('../config');
const { handleError } = require('./errorHandler');
const genius = require('genius-lyrics-api');
const LyricsFinder = require('lyrics-finder');

const Client = new genius.Client(geniusApiToken);

/**
 * Fetches lyrics for a given song using Genius API.
 * @param {string} songTitle The title of the song to fetch lyrics for.
 * @param {string} artistName The name of the artist of the song.
 * @returns {Promise<string>} A promise that resolves to the lyrics, or an empty string if lyrics are not found.
 */
const getLyricsFromGenius = async (songTitle, artistName) => {
  try {
    const response = await Client.songs.search(songTitle, { artist: artistName });
    if (response.hits.length > 0) {
      const song = response.hits[0].result;
      const lyrics = await song.lyrics();
      return lyrics;
    } else {
      return '';
    }
  } catch (error) {
    handleError(error, 'getLyricsFromGenius');
    return '';
  }
};

/**
 * Fetches lyrics for a given song using lyrics-finder.
 * @param {string} songTitle The title of the song to fetch lyrics for.
 * @param {string} artistName The name of the artist of the song.
 * @returns {Promise<string>} A promise that resolves to the lyrics, or an empty string if lyrics are not found.
 */
const getLyricsFromLyricsFinder = async (songTitle, artistName) => {
  try {
    const lyrics = await LyricsFinder.findLyrics(songTitle, artistName);
    return lyrics;
  } catch (error) {
    handleError(error, 'getLyricsFromLyricsFinder');
    return '';
  }
};

/**
 * Retrieves lyrics for a given song.
 * Attempts to fetch lyrics from Genius first and then from lyrics-finder if not found.
 * @param {string} songTitle The title of the song to fetch lyrics for.
 * @param {string} artistName The name of the artist of the song.
 * @returns {Promise<string>} A promise that resolves to the lyrics, or an empty string if lyrics are not found.
 */
const getLyrics = async (songTitle, artistName) => {
  try {
    let lyrics = await getLyricsFromGenius(songTitle, artistName);
    if (!lyrics) {
      lyrics = await getLyricsFromLyricsFinder(songTitle, artistName);
    }
    return lyrics;
  } catch (error) {
    handleError(error, 'getLyrics');
    return '';
  }
};

module.exports = { getLyrics };