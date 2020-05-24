const helpMessage = `
*Twitter screenshot bot*
This bot takes screenshot of tweet that you provided by link
\`<link>\` - twitter link (e.g. \`https://twitter.com/BarackObama/status/896523232098078720\`)
`;
const waitMessage = 'Please wait, it will takes 5-10 seconds. ⏳';
const errorMessage = 'Something went wrong, check your link or try later. 🚫';

module.exports = {
  helpMessage,
  waitMessage,
  errorMessage,
};
