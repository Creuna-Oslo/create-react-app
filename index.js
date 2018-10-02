/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { copySync, ensureDirSync } = require('fs-extra');
const path = require('path');

const canWriteFiles = require('./utils/can-write-files');
const createApiHelper = require('./templates/api-helper/create-api-helper');
const createPackageJson = require('./templates/package-json/create-package-json');
const createReadme = require('./templates/readme/create-readme');
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
    const templateDir = path.join(__dirname, 'templates');

    try {
      await canWriteFiles(projectPath);
    } catch (errorMessage) {
      return reject(errorMessage);
    }

    // If the promise tries to catch errors asynchronously (in a .catch()), Node will output a 'UnhandledPromiseRejectionWarning' warning which hides the actual error in a wall of text and does not output a stack trace. Reject synchronously to avoid this
    try {
      // Make build directory if it doesn't exist
      ensureDirSync(projectPath);

      copySync(path.join(__dirname, 'static-files'), projectPath, {
        filter: filterFiles.bind(null, {
          useAnalyticsHelper,
          useMessenger,
          useResponsiveImages
        })
      });

      // README.md
      fs.writeFileSync(
        path.join(projectPath, 'README.md'),
        createReadme({ projectName })
      );

      // package.json
      fs.writeFileSync(
        path.join(projectPath, 'package.json'),
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
        path.join(projectPath, '.eslintrc.json')
      );

      // api-helper
      if (useApiHelper) {
        fs.writeFileSync(
          path.join(projectPath, 'source/js/api-helper.js'),
          createApiHelper({ useAnalyticsHelper, useMessenger })
        );
      }

      return resolve({
        messages: [
          { emoji: '🦄', text: chalk.greenBright('All done!\n') },
          { text: 'Next steps:' }
        ]
          .concat(
            projectPath !== process.cwd()
              ? {
                  text: `• ${chalk.blueBright(
                    `cd ${path.basename(projectPath)}`
                  )}`
                }
              : []
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
