module.exports = {
  mocha: true,
  path: './tests',
  webdriverio: {
    desiredCapabilities: {
      chromeOptions: {
        args: ['headless', 'disable-gpu']
      }
    }
  }
};
