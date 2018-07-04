/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');

const { canWriteFiles, writeFiles } = require('../index');

const logError = text => {
  console.log(`🚫  ${chalk.redBright(text)}`);
  process.exit(1);
};

const logMessage = ({ emoji, text }) => {
  console.log(`${emoji ? `${emoji} ` : ''} ${text}`);
};

const projectPath = path.join(process.cwd(), process.argv[2] || '');

canWriteFiles(projectPath)
  .then(async () => {
    writeFiles({
      authorEmail: 'john.doe@email.com',
      authorName: 'John Doe',
      projectName: 'my-project',
      projectPath,
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
