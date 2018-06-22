/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { copySync, ensureDirSync } = require('fs-extra');
const path = require('path');

const canWriteFiles = require('./utils/can-write-files');
const createApiHelper = require('./templates/api-helper/create-api-helper');
const createAppComponent = require('./templates/app-component/create-app-component');
const createHomeComponent = require('./templates/home-component/create-home-component');
const createPackageJson = require('./templates/package-json/create-package-json');
const filterFiles = require('./utils/filter-files');

function writeFiles({
  authorEmail,
  authorName,
  projectName,
  projectPath,
  useApiHelper,
  useAnalyticsHelper,
  useMessenger,
  useResponsiveImages
}) {
  return new Promise(async (resolve, reject) => {
    const buildDir = path.join(process.cwd(), projectPath || '');
    const templateDir = path.join(__dirname, 'templates');

    try {
      await canWriteFiles(projectPath);
    } catch (errorMessage) {
      return reject(errorMessage);
    }

    // If the promise tries to catch errors asynchronously (in a .catch()), Node will output a 'UnhandledPromiseRejectionWarning' warning which hides the actual error in a wall of text and does not output a stack trace. Reject synchronously to avoid this
    try {
      // Make build directory if it doesn't exist
      ensureDirSync(buildDir);

      copySync(path.join(__dirname, 'static-files'), buildDir, {
        filter: filterFiles.bind(null, {
          useAnalyticsHelper,
          useMessenger,
          useResponsiveImages
        })
      });

      // package.json
      fs.writeFileSync(
        path.join(buildDir, 'package.json'),
        createPackageJson({
          authorEmail,
          authorName,
          projectName,
          useAnalyticsHelper,
          useMessenger
        })
      );

      // eslintrc
      // This was moved to 'templates' because it messed up autoformatting when editing files in 'static-files'
      fs.copyFileSync(
        path.join(templateDir, 'eslintrc/.eslintrc.json'),
        path.join(buildDir, '.eslintrc.json')
      );

      // api-helper
      if (useApiHelper) {
        fs.writeFileSync(
          path.join(buildDir, 'source/js/api-helper.js'),
          createApiHelper({ useAnalyticsHelper, useMessenger })
        );
      }

      // app.jsx
      fs.writeFileSync(
        path.join(buildDir, 'source/mockup/app.jsx'),
        createAppComponent(projectName)
      );

      // home.jsx
      fs.writeFileSync(
        path.join(buildDir, 'source/mockup/pages/home.jsx'),
        createHomeComponent(projectName)
      );

      return resolve({
        buildDir,
        messages: [
          { emoji: '🦄', text: chalk.greenBright('All done!') },
          { text: 'Next steps:' }
        ]
          .concat(
            projectPath ? { text: chalk.blueBright(`• cd ${projectPath}`) } : []
          )
          .concat([
            {
              text: `• ${chalk.blueBright('yarn')} or ${chalk.cyan(
                'npm install'
              )} to install dependencies,`
            },
            {
              text: `• ${chalk.blueBright('yarn dev')} or ${chalk.cyan(
                'npm run dev'
              )} to start working!\n`
            }
          ])
      });
    } catch (error) {
      return reject(error.stack || error.message);
    }
  });
}

module.exports = {
  canWriteFiles,
  writeFiles
};
