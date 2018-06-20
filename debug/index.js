const createApp = require('../index');

createApp(process.argv[2], messages => {
  messages.forEach(({ text }) => {
    console.log(text);
  });
});
