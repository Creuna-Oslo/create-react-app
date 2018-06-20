const createApp = require('../index');

createApp(process.argv[2], (buildDir, messages) => {
  messages.forEach(({ text }) => {
    console.log(text);
  });
});
