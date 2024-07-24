const { handleError } = require('./errorHandler');
const { mongoUri } = require('../config');
const mongoose = require('mongoose');

// Define the playlist schema
const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guildId: { type: String, required: true },
  songs: [{
    title: { type: String, required: true },
    author: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    source: { type: String, required: true },
  }],
});

// Create the Playlist model
const Playlist = mongoose.model('Playlist', playlistSchema);

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB!');
  } catch (error) {
    handleError(error, 'connectToDatabase');
  }
};

/**
 * Creates a new playlist in the database.
 * @param {string} guildId The ID of the Discord guild.
 * @param {string} name The name of the playlist.
 * @param {Array<Object>} songs An array of song objects.
 * @returns {Promise<Playlist>} A promise that resolves to the created playlist object.
 */
const createPlaylist = async (guildId, name, songs) => {
  try {
    const newPlaylist = new Playlist({
      name,
      guildId,
      songs,
    });
    await newPlaylist.save();
    return newPlaylist;
  } catch (error) {
    handleError(error, 'createPlaylist');
    return null;
  }
};

/**
 * Retrieves a playlist from the database by its name and guild ID.
 * @param {string} guildId The ID of the Discord guild.
 * @param {string} name The name of the playlist.
 * @returns {Promise<Playlist>} A promise that resolves to the playlist object, or null if not found.
 */
const getPlaylist = async (guildId, name) => {
  try {
    const playlist = await Playlist.findOne({ guildId, name });
    return playlist;
  } catch (error) {
    handleError(error, 'getPlaylist');
    return null;
  }
};

/**
 * Updates an existing playlist in the database.
 * @param {string} guildId The ID of the Discord guild.
 * @param {string} name The name of the playlist.
 * @param {Array<Object>} songs An array of song objects.
 * @returns {Promise<Playlist>} A promise that resolves to the updated playlist object.
 */
const updatePlaylist = async (guildId, name, songs) => {
  try {
    const updatedPlaylist = await Playlist.findOneAndUpdate({ guildId, name }, { songs }, { new: true });
    return updatedPlaylist;
  } catch (error) {
    handleError(error, 'updatePlaylist');
    return null;
  }
};

/**
 * Deletes a playlist from the database.
 * @param {string} guildId The ID of the Discord guild.
 * @param {string} name The name of the playlist.
 * @returns {Promise<void>} A promise that resolves when the playlist is deleted.
 */
const deletePlaylist = async (guildId, name) => {
  try {
    await Playlist.deleteOne({ guildId, name });
  } catch (error) {
    handleError(error, 'deletePlaylist');
  }
};

/**
 * Gets all playlists for a specific guild.
 * @param {string} guildId The ID of the Discord guild.
 * @returns {Promise<Array<Playlist>>} A promise that resolves to an array of playlist objects.
 */
const getAllPlaylistsForGuild = async (guildId) => {
  try {
    const playlists = await Playlist.find({ guildId });
    return playlists;
  } catch (error) {
    handleError(error, 'getAllPlaylistsForGuild');
    return [];
  }
};

module.exports = {
  connectToDatabase,
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylistsForGuild,
};