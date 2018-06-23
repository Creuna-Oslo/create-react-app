const createApp = require('../index');

createApp(process.argv[2]).then(({ messages }) => {
  messages.forEach(({ text }) => {
    console.log(text);
  });
});
