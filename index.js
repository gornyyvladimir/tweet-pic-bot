require('dotenv').config();
const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const querystring = require('querystring');
const uniqueId = require('lodash/uniqueId');

const getScreenShot = async (url, filePath) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 3,
  });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
  await page.addStyleTag({ content: 'twitter-widget{border: 10px solid #fff}' });
  const element = await page.$('twitter-widget');
  await element.screenshot({ path: filePath });
  await browser.close();
};

const helpMessage = `
*Twitter screenshot bot*
This bot takes screenshot of tweet that you provided by link
\`<link>\` - twitter link (e.g. \`https://twitter.com/BarackObama/status/896523232098078720\`)
`;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(helpMessage, { parse_mode: 'Markdown' }));
bot.help((ctx) => ctx.reply(helpMessage, { parse_mode: 'Markdown' }));

bot.hears(/https?:\/\/(www\.)?twitter\.com.*/, async (ctx) => {
  const options = {
    query: ctx.message.text,
    widget: 'Tweet',
    lang: ctx.from.language_code,
    // theme: 'dark',
  };
  const query = querystring.stringify(options);
  const url = `https://publish.twitter.com/?${query}`;

  const filePath = `res/${uniqueId(ctx.from.username + '-')}-shot.png`;

  try {
    ctx.replyWithChatAction('upload_photo');
    ctx.reply('Please wait, it will takes 5-10 seconds. ⏳');
    await getScreenShot(url, filePath);
    await ctx.replyWithPhoto({ source: filePath });
    await fs.unlink(filePath);
    console.log(`${filePath} was deleted`);
  } catch (err) {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    ctx.reply('Something went wrong, check your link or try later. 🚫');
  }
});

bot.on('message', (ctx) =>
  ctx.reply(`I can't understand you. You should send me a *twitter link*. 🔗`, {
    parse_mode: 'Markdown',
  }),
);

bot.launch();
