const { Client, IntentsBitField, Collection } = require('discord.js');
const { token } = require('./config.js');
const { loadCommands } = require('./utils/handler.js');
const musicPlayer = require('./utils/musicPlayer'); // Import the musicPlayer module

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.MessageContent] });

client.commands = new Collection();

loadCommands(client);

client.on('ready', () => {
  console.log(`${client.user.tag} is ready!`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({ content: 'Invalid command!' });
    }

    try {
      await command.run(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'There was an error executing this command!' });
    }
  } else if (interaction.isButton()) {
    // Handle button interactions here
    // For example, you could use buttons for playlist management, queue control, etc.
    const queue = musicPlayer.getQueue(interaction.guild);

    if (!queue) {
      return interaction.reply({ content: 'There is no music playing in this server!' });
    }

    try {
      // Implement button functionality based on the button's ID
      switch (interaction.customId) {
        case 'play':
          queue.play();
          await interaction.update({ content: 'Resumed playback!' });
          break;
        case 'pause':
          queue.pause();
          await interaction.update({ content: 'Paused playback!' });
          break;
        case 'skip':
          musicPlayer.skip(interaction.guild);
          await interaction.update({ content: 'Skipped to the next song!' });
          break;
        // Add more button functionalities as needed
      }
    } catch (error) {
      console.error(error);
      await interaction.update({ content: 'There was an error handling this interaction!' });
    }
  } else if (interaction.isSelectMenu()) {
    // Handle select menu interactions here
    // For example, you could use select menus for choosing music sources, playlists, etc.
    try {
      // Implement select menu functionality based on the menu's ID
      switch (interaction.customId) {
        // Add more select menu functionalities as needed
      }
    } catch (error) {
      console.error(error);
      await interaction.update({ content: 'There was an error handling this interaction!' });
    }
  }
});

client.login(token);