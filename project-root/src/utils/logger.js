const chalk = require('chalk');
const moment = require('moment');

/**
 * A simple logger for the Discord bot.
 */
class Logger {
  /**
   * Logs a message to the console with a timestamp and log level.
   * @param {string} level The log level (e.g., 'info', 'warn', 'error').
   * @param {string} message The message to log.
   * @param {string} [context] An optional context for the log message.
   */
  log(level, message, context) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const levelColor = this.getLevelColor(level);
    const logMessage = `${chalk.gray(timestamp)} ${levelColor(level.toUpperCase())}: ${message}`;

    if (context) {
      console.log(logMessage, chalk.gray(`[${context}]`));
    } else {
      console.log(logMessage);
    }
  }

  /**
   * Gets the color for a log level.
   * @param {string} level The log level.
   * @returns {function} The color function for the log level.
   */
  getLevelColor(level) {
    switch (level) {
      case 'info':
        return chalk.blue;
      case 'warn':
        return chalk.yellow;
      case 'error':
        return chalk.red;
      default:
        return chalk.gray;
    }
  }

  /**
   * Logs an info message.
   * @param {string} message The info message.
   * @param {string} [context] An optional context for the log message.
   */
  info(message, context) {
    this.log('info', message, context);
  }

  /**
   * Logs a warning message.
   * @param {string} message The warning message.
   * @param {string} [context] An optional context for the log message.
   */
  warn(message, context) {
    this.log('warn', message, context);
  }

  /**
   * Logs an error message.
   * @param {string} message The error message.
   * @param {string} [context] An optional context for the log message.
   */
  error(message, context) {
    this.log('error', message, context);
  }
}

module.exports = new Logger();