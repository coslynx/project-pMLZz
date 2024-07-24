const { token, youtubeApiKey, spotifyClientId, spotifyClientSecret, soundcloudClientId, soundcloudClientSecret, geniusApiToken, twitchClientId, twitchClientSecret, lastfmApiKey, mongoUri, mysqlHost, mysqlUser, mysqlPassword, mysqlDatabase } = require('dotenv').config().parsed;

module.exports = {
  token,
  youtubeApiKey,
  spotifyClientId,
  spotifyClientSecret,
  soundcloudClientId,
  soundcloudClientSecret,
  geniusApiToken,
  twitchClientId,
  twitchClientSecret,
  lastfmApiKey,
  mongoUri,
  mysqlHost,
  mysqlUser,
  mysqlPassword,
  mysqlDatabase,
};