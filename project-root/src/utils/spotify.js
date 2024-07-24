const { spotifyClientId, spotifyClientSecret } = require('../config');
const { handleError } = require('./errorHandler');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClientId,
  clientSecret: spotifyClientSecret,
});

/**
 * Retrieves a Spotify track from a given URL.
 * @param {string} url The URL of the Spotify track.
 * @returns {Promise<SpotifyApi.Track>} A promise that resolves to the Spotify track object, or null if the track is not found.
 */
const getTrackFromURL = async (url) => {
  try {
    const trackId = url.split('/').pop();
    const track = await spotifyApi.getTrack(trackId);
    return track.body;
  } catch (error) {
    handleError(error, 'getTrackFromURL');
    return null;
  }
};

module.exports = { getTrackFromURL };