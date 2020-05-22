// require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');
const linkHandler = require('./handlers/link');
const messageHandler = require('./handlers/message');

// env variables
const token = process.env.BOT_TOKEN;
const port = process.env.PORT || 3000;
const url = process.env.URL || 'https://tweet-pic-bot.herokuapp.com/';

// app init
const expressApp = express();

// setting up a bot to work with express
const bot = new Telegraf(token);
expressApp.use(bot.webhookCallback(`/bot${token}`));
bot.telegram
  .setWebhook(`${url}/bot${token}`)
  .then(() => console.log('all is ok', token))
  .catch(() => console.log('error', token));
// for bot working in chats
bot.telegram.getMe().then(botInfo => {
  bot.options.username = botInfo.username;
});

// handle bot commands
startCommand(bot);
linkHandler(bot);
messageHandler(bot);

// express server for web
expressApp.get('/', (req, res) => {
  res.send('TweetPicBot is working');
});

expressApp.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
