require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');
const linkHandler = require('./handlers/link');

// env variables
const token = process.env.BOT_TOKEN;
const port = process.env.PORT || 3000;
const url = process.env.URL || 'https://tweet-pic-bot.herokuapp.com';

// setting up a bot to work with express
const bot = new Telegraf(token);
// handle bot commands
startCommand(bot);
linkHandler(bot);

if (process.env.NODE_ENV === 'production') {
  // app init
  const expressApp = express();
  // setting up a bot to work with express
  expressApp.use(bot.webhookCallback(`/bot${token}`));
  bot.telegram.setWebhook(`${url}/bot${token}`);
  // express server for web
  expressApp.get('/', (req, res) => {
    res.send('TweetPicBot is working');
  });
  expressApp.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
} else {
  // We are running in development mode
  bot.launch();
}
