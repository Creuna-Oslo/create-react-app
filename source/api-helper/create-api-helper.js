/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const eslintrc = require('../../.eslintrc.json');

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), { encoding: 'utf-8' });
}

module.exports = function({ useAnalyticsHelper, useMessenger }) {
  const baseFile = readFile('api-helper.js');
  const analyticsHandler = readFile('handle-analytics.js');
  const messengerFetchError = readFile('messenger-fetch-error.js');
  const messageHandler = readFile('handle-message.js');

  const newFileContent = prettier.format(
    baseFile
      .replace(
        '//$analyticsImport',
        useAnalyticsHelper ? `import analytics from './analytics';` : ''
      )
      .replace('//$handleAnalytics', useAnalyticsHelper ? analyticsHandler : '')
      .replace(
        '//$callAnalyticsHandler',
        useAnalyticsHelper ? '.then(handleAnalytics)' : ''
      )
      .replace(
        '//$messengerImport',
        useMessenger
          ? `import getData from '@creuna/utils';
        import messenger from './messenger';`
          : ''
      )
      .replace('//$handleMessage', useMessenger ? messageHandler : '')
      .replace(
        '//$callMessageHandler',
        useMessenger ? '.then(handleUserMessages)' : ''
      )
      .replace(
        '//$messengerFetchError',
        useMessenger ? messengerFetchError : ''
      ),
    eslintrc.rules['prettier/prettier'][1]
  );

  return newFileContent;
};
