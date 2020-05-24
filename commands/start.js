const config = require('../config');

module.exports = bot =>
  bot.command(['start, help'], ctx => ctx.reply(config.helpMessage, { parse_mode: 'Markdown' }));
