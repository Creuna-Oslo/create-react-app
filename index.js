#! /usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { copySync, ensureDirSync } = require('fs-extra');
const path = require('path');

const prompt = require('./utils/prompt');

const createApiHelper = require('./source/api-helper/create-api-helper');
const createAppComponent = require('./source/app-component/create-app-component');
const createFluidImage = require('./source/fluid-image/create-fluid-image');
const createHomeComponent = require('./source/home-component/create-home-component');
const createPackage = require('./source/package/create-package');
const createWebpackConfig = require('./source/webpack/create-webpack-config');

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
const sourceDir = path.join(__dirname, 'source');

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
      text: '✏️  Project name (kebab-case)'
    },
    authorName: {
      text: '✏️  Your full name'
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
    },
    useInlineSvg: {
      text: '☢️  Use inline SVG icons in React?',
      type: Boolean
    }
  },
  ({
    authorEmail,
    authorName,
    projectName,
    useApiHelper,
    useAnalyticsHelper,
    useInlineSvg,
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
        const isIconFile =
          src.includes('components/icon') ||
          src.includes('assets/icons/icons.js');
        const isImageFile =
          src.includes('components/image') ||
          src.includes('js/responsive-images.js');

        if (isAnalyticsFile) {
          return useAnalyticsHelper;
        }

        if (isIconFile) {
          return useInlineSvg;
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

    // webpack.config.js
    fs.writeFileSync(
      path.join(buildDir, 'webpack.config.js'),
      createWebpackConfig(useInlineSvg)
    );

    // package.json
    fs.writeFileSync(
      path.join(buildDir, 'package.json'),
      createPackage({
        authorEmail,
        authorName,
        projectName,
        useAnalyticsHelper,
        useInlineSvg,
        useMessenger
      })
    );

    // eslintrc
    // This was moved to 'source' because it messed up autoformatting when editing files in 'static-files'
    fs.copyFileSync(
      path.join(sourceDir, 'eslintrc/.eslintrc.json'),
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

    // fluid-image
    const fluidImageBuildDir = path.join(
      buildDir,
      'source/components/fluid-image'
    );
    fs.mkdirSync(fluidImageBuildDir);
    fs.writeFileSync(
      path.join(fluidImageBuildDir, 'fluid-image.jsx'),
      createFluidImage(useResponsiveImages)
    );
    fs.copyFileSync(
      path.join(sourceDir, 'fluid-image/fluid-image.scss'),
      path.join(fluidImageBuildDir, 'fluid-image.scss')
    );
    fs.copyFileSync(
      path.join(sourceDir, 'fluid-image/index.js'),
      path.join(fluidImageBuildDir, 'index.js')
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
