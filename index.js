#! /usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { copySync, ensureDirSync } = require('fs-extra');
const path = require('path');

const prompt = require('./utils/prompt');

const createApiHelper = require('./templates/api-helper/create-api-helper');
const createAppComponent = require('./templates/app-component/create-app-component');
const createHomeComponent = require('./templates/home-component/create-home-component');
const createPackage = require('./templates/package-json/create-package-json');

const providedDir = process.argv[2];
const isAbsolutePath =
  providedDir && (providedDir[0] === '~' || providedDir[0] === '/');

if (isAbsolutePath) {
  console.log(
    `🚫  create-creuna-react-app ${chalk.redBright(
      'does not support absolute paths. Aborting'
    )}`
  );
  process.exit(1);
}

const buildDir = path.join(process.cwd(), providedDir || '.');
const templateDir = path.join(__dirname, 'templates');

// Check for preexisting files or folders
if (providedDir && fs.existsSync(buildDir)) {
  // Abort if a directory is provided and it already exists to avoid overriding existing files
  console.log(`🚫  ${chalk.redBright('Directory already exists. Aborting')}`);
  process.exit(1);
} else if (!providedDir) {
  // Abort if files or folders already exists in the current working directory
  const filesInBuildDir = fs
    .readdirSync(buildDir)
    .filter(fileName => ['.DS_Store', '.git'].indexOf(fileName) === -1);

  if (filesInBuildDir.length) {
    console.log(
      `🚫  ${chalk.redBright(
        `There's already stuff in the current directory. Aborting`
      )}`
    );
    console.log(chalk.redBright('Found the following stuff:'));
    filesInBuildDir.forEach(fileName => {
      console.log(`  ${chalk.redBright(fileName)}`);
    });
    process.exit(1);
  }
}

prompt(
  {
    projectName: {
      text: '🚀  Project name (kebab-case)'
    },
    authorName: {
      text: '😸  Your full name'
    },
    authorEmail: {
      text: '💌  Your email address'
    },
    useApiHelper: {
      text: '☁️  Include API-helper?',
      type: Boolean
    },
    useMessenger: {
      text: '💬  Include message helper for API?',
      type: Boolean
    },
    useAnalyticsHelper: {
      text: '📈  Include Analytics helper?',
      type: Boolean
    },
    useResponsiveImages: {
      text: '🖼️  Include responsive images helper?',
      type: Boolean
    }
  },
  ({
    authorEmail,
    authorName,
    projectName,
    useApiHelper,
    useAnalyticsHelper,
    useMessenger,
    useResponsiveImages
  }) => {
    // Make build directory if it doesn't exist
    ensureDirSync(buildDir);

    copySync(path.join(__dirname, 'static-files'), buildDir, {
      filter: src => {
        const isAnalyticsFile = src.includes('js/analytics.js');
        const isMessengerFile =
          src.includes('js/messenger.js') || src.includes('components/message');
        const isImageFile =
          src.includes('components/image') ||
          src.includes('components/fluid-image') ||
          src.includes('js/responsive-images.js');

        if (isAnalyticsFile) {
          return useAnalyticsHelper;
        }

        if (isMessengerFile) {
          return useMessenger;
        }

        if (isImageFile) {
          return useResponsiveImages;
        }

        return true;
      }
    });

    // package.json
    fs.writeFileSync(
      path.join(buildDir, 'package.json'),
      createPackage({
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

    // prompt-script
    fs.copyFileSync(
      path.join(__dirname, 'utils/prompt.js'),
      path.join(buildDir, 'scripts/prompt.js')
    );

    console.log(`\n🦄  ${chalk.greenBright('All done!')}\n`);
    console.log('Next steps:');

    if (providedDir) {
      console.log(chalk.blueBright(`• cd ${providedDir}`));
    }

    console.log(
      `• ${chalk.blueBright('yarn')} or ${chalk.cyan(
        'npm install'
      )} to install dependencies,`
    );
    console.log(
      `• ${chalk.blueBright('yarn dev')} or ${chalk.cyan(
        'npm run dev'
      )} to start working!\n`
    );
  }
);
