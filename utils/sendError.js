const config = require('../config');

module.exports = (err, ctx) => {
  const adminChatId = process.env.ADMIN_ID;
  const errorMessage =
    `error: ${err.name} ${err.message}\n` +
    `message: ${ctx.message.text}\n` +
    `type: ${ctx.updateType}\n`;
  // eslint-disable-next-line no-console
  console.log(errorMessage, err);
  ctx.telegram.sendMessage(adminChatId, errorMessage);
  ctx.reply(config.errorMessage);
};
