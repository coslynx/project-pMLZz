const logger = require('./logger');

/**
 * Handles errors thrown during the bot's execution.
 * 
 * @param {Error} error The error that was thrown.
 * @param {string} [context] An optional context for the error.
 */
const handleError = (error, context) => {
  logger.error(error.message, context);

  // Additional error handling logic can be added here, such as:
  // - Sending an error message to a designated channel
  // - Logging the error to a file
  // - Reporting the error to a monitoring service
};

module.exports = { handleError };