const config = require('../config');

module.exports = bot => {
  bot.on('message', ctx =>
    ctx.reply(config.notFoundMessage, {
      parse_mode: 'Markdown',
    })
  );
};
