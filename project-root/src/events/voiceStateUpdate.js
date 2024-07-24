const { Client, Guild } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute(oldState, newState) {
    // If the user joins a voice channel
    if (newState.channel && !oldState.channel) {
      // Check if the bot is in the same voice channel
      if (newState.channel.members.has(newState.guild.me.id)) {
        // Do nothing, as the bot is already in the same voice channel
      } else {
        // Check if the user is the one who summoned the bot
        if (newState.member.id === newState.guild.me.id) {
          // Do nothing, as the bot was manually joined
        } else {
          // Check if there are other users in the channel
          if (newState.channel.members.size > 1) {
            // Check if the bot is already in a voice channel
            const queue = musicPlayer.getQueue(newState.guild);
            if (queue) {
              // Try to move the bot to the new channel
              try {
                queue.voiceChannel.leave();
                newState.channel.join();
                queue.voiceChannel = newState.channel;
                console.log(
                  `Bot moved to ${newState.channel.name} in ${newState.guild.name}!`
                );
              } catch (error) {
                console.error(
                  `Error moving bot to ${newState.channel.name} in ${newState.guild.name}:`,
                  error
                );
              }
            } else {
              // Bot is not in a voice channel, join the new channel
              try {
                newState.channel.join();
                console.log(
                  `Bot joined ${newState.channel.name} in ${newState.guild.name}!`
                );
              } catch (error) {
                console.error(
                  `Error joining ${newState.channel.name} in ${newState.guild.name}:`,
                  error
                );
              }
            }
          } else {
            // No other users in the channel, leave the channel
            try {
              newState.channel.leave();
              console.log(
                `Bot left ${newState.channel.name} in ${newState.guild.name} as there are no other users!`
              );
            } catch (error) {
              console.error(
                `Error leaving ${newState.channel.name} in ${newState.guild.name}:`,
                error
              );
            }
          }
        }
      }
    }
    // If the user leaves a voice channel
    else if (!newState.channel && oldState.channel) {
      // Check if the bot is in the same voice channel
      if (oldState.channel.members.has(oldState.guild.me.id)) {
        // Check if there are other users in the channel
        if (oldState.channel.members.size === 0) {
          // Leave the voice channel
          try {
            oldState.channel.leave();
            console.log(
              `Bot left ${oldState.channel.name} in ${oldState.guild.name} as there are no other users!`
            );
          } catch (error) {
            console.error(
              `Error leaving ${oldState.channel.name} in ${oldState.guild.name}:`,
              error
            );
          }
        }
      }
    }
  },
};