require('dotenv').config();
const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');
const linkHandler = require('./handlers/link');
const messageHandler = require('./handlers/message');

const bot = new Telegraf(process.env.BOT_TOKEN);

startCommand(bot);
linkHandler(bot);
messageHandler(bot);

bot.launch();
