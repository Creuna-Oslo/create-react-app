/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');

const { canWriteFiles, writeFiles } = require('../index');

const logError = text => {
  console.log(`🚫  ${chalk.redBright(text)}`);
  process.exit(1);
};

const logMessage = ({ emoji, text }) => {
  console.log(`${emoji ? `${emoji} ` : ''} ${text}`);
};

canWriteFiles(process.argv[2])
  .then(async () => {
    writeFiles({
      authorEmail: 'john.doe@email.com',
      authorName: 'John Doe',
      projectName: 'my-project',
      projectPath: process.argv[2],
      useApiHelper: true,
      useAnalyticsHelper: true,
      useMessenger: true,
      useResponsiveImages: true
    })
      .then(({ messages }) => {
        messages.forEach(logMessage);
      })
      .catch(logError);
  })
  .catch(logError);
