require('dotenv').config();
const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const querystring = require('querystring');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.hears(/https?:\/\/(www\.)?twitter\.com.*/, async (ctx) => {
  // console.log('here');
  // const input = ctx.message.text.split(' ');
  // if (input.length === 1) {
  //   ctx.reply('You must give me a link');
  //   return;
  // }

  // input.shift();
  console.log(ctx.from);

  const twitterUrl = ctx.message.text;
  const options = {
    query: twitterUrl,
    widget: 'Tweet',
    lang: ctx.from.language_code,
    // theme: 'dark',
  };
  const query = querystring.stringify(options);
  const publishUrl = `https://publish.twitter.com/?${query}`;
  console.log(publishUrl);

  const filePath = `res/${ctx.from.username + Math.random()}-shot.png`;

  ctx.replyWithChatAction('upload_photo');

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 3,
  });
  await page.goto(publishUrl, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: 'twitter-widget{border: 10px solid #fff}' });
  const element = await page.waitForSelector('twitter-widget');
  await element.screenshot({ path: filePath });
  await browser.close();
  await ctx.replyWithPhoto({ source: filePath });
  await fs.unlink(filePath);
  console.log(`${filePath} was deleted`);
});

bot.launch();
