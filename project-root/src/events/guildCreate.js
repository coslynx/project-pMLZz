const { Client, Guild } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'guildCreate',
  once: true,
  execute(guild) {
    console.log(`Joined guild: ${guild.name} (${guild.id})`);
    // You can add logic here to customize the bot's behavior when it joins a new guild.
    // For example, you could send a welcome message to the general channel:
    // const generalChannel = guild.channels.cache.find(
    //   (channel) => channel.type === 'GUILD_TEXT' && channel.name === 'general'
    // );
    // if (generalChannel) {
    //   generalChannel.send(
    //     `Hello ${guild.name}! Thanks for inviting me. Type /help to see what I can do.`
    //   );
    // }
  },
};