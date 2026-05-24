require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('✓ Bot ready!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === 'ping') {
    message.reply('pong!');
  }

  if (message.content === 'join') {
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      return message.reply('Join voice dulu!');
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guildId,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      message.reply(`Bot masuk ke ${voiceChannel.name}`);
      console.log('Bot joined:', voiceChannel.name);
    } catch (error) {
      console.error('Error:', error.message);
      message.reply('Gagal join: ' + error.message);
    }
  }

  if (message.content === 'leave') {
    const connection = client.voice.connections.first();
    if (connection) {
      connection.destroy();
      message.reply('Bot keluar');
    } else {
      message.reply('Bot nggak ada di voice');
    }
  }
});

client.login(process.env.TOKEN);
