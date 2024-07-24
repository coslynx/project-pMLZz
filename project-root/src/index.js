const { Client, IntentsBitField, Collection } = require('discord.js');
const { token } = require('./config.js');
const { loadCommands } = require('./utils/handler.js');

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
  }
});

client.login(token);