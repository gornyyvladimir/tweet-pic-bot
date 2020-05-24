const config = require('../config');

module.exports = bot => {
  bot.start(ctx => ctx.reply(config.helpMessage, { parse_mode: 'Markdown' }));
  bot.help(ctx => ctx.reply(config.helpMessage, { parse_mode: 'Markdown' }));
};
