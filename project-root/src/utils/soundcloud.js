const { soundcloudClientId, soundcloudClientSecret } = require('../config');
const { handleError } = require('./errorHandler');
const Soundcloud = require('soundcloud');

const client = Soundcloud.init({
  client_id: soundcloudClientId,
  client_secret: soundcloudClientSecret,
});

/**
 * Retrieves a SoundCloud track from a given URL.
 * @param {string} url The URL of the SoundCloud track.
 * @returns {Promise<Soundcloud.Track>} A promise that resolves to the SoundCloud track object, or null if the track is not found.
 */
const getTrackFromURL = async (url) => {
  try {
    const track = await client.get('/resolve', { url });
    return track;
  } catch (error) {
    handleError(error, 'getTrackFromURL');
    return null;
  }
};

module.exports = { getTrackFromURL };