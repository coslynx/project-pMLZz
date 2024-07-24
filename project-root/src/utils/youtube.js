const { youtubeApiKey } = require('../config');
const { handleError } = require('./errorHandler');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

/**
 * Searches for a YouTube video by query and returns the first result.
 * @param {string} query The search query.
 * @returns {Promise<ytsr.Item>} A promise that resolves to the first search result, or null if no results are found.
 */
const searchYouTube = async (query) => {
  try {
    const searchResults = await ytsr(query, { limit: 1, key: youtubeApiKey });
    const firstResult = searchResults.items[0];
    return firstResult;
  } catch (error) {
    handleError(error, 'searchYouTube');
    return null;
  }
};

/**
 * Retrieves the video information for a given YouTube URL.
 * @param {string} url The YouTube video URL.
 * @returns {Promise<ytdl.videoInfo>} A promise that resolves to the video information object, or null if the URL is invalid.
 */
const getYouTubeVideoInfo = async (url) => {
  try {
    const info = await ytdl.getInfo(url);
    return info;
  } catch (error) {
    handleError(error, 'getYoutubeVideoInfo');
    return null;
  }
};

module.exports = { searchYouTube, getYouTubeVideoInfo };