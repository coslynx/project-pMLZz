const { readdirSync } = require('fs');
const { join } = require('path');

/**
 * Loads all commands from the commands directory.
 * @param {Client} client The Discord client instance.
 */
const loadCommands = (client) => {
  const commandFolders = readdirSync(join(__dirname, '..'));
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, '..', folder)).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(join(__dirname, '..', folder, file));
      client.commands.set(command.data.name, command);
    }
  }
};

module.exports = { loadCommands };