const uniqueId = require('lodash/uniqueId');
const querystring = require('querystring');
const fs = require('fs').promises;
const getScreenShot = require('../utils/getScreenShot');
const config = require('../config');

module.exports = bot => {
  bot.hears(/https?:\/\/(www\.)?twitter\.com.*/, async ctx => {
    const options = {
      query: ctx.message.text,
      widget: 'Tweet',
      lang: ctx.from.language_code,
      // theme: 'dark',
    };
    const query = querystring.stringify(options);
    const url = `https://publish.twitter.com/?${query}`;

    const filePath = `${uniqueId(`${ctx.from.username}-`)}-shot.png`;

    try {
      await ctx.reply(config.waitMessage);
      await ctx.replyWithChatAction('upload_photo');
      await getScreenShot(url, filePath);
      await ctx.replyWithPhoto({ source: filePath });
      await fs.unlink(filePath);
    } catch (err) {
      // eslint-disable-next-line no-console
      const adminChatId = process.env.ADMIN_ID;
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
      ctx.telegram.sendMessage(adminChatId, `${err.name} ${err.message}`);
      ctx.reply(config.errorMessage);
    }
  });
};
