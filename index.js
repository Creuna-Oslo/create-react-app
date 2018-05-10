/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const { copySync } = require('fs-extra');
const path = require('path');

const prompt = require('./utils/prompt');

const createApiHelper = require('./source/api-helper/create-api-helper');
const createAppComponent = require('./source/app-component/create-app-component');
const createFluidImage = require('./source/fluid-image/create-fluid-image');
const createHomeComponent = require('./source/home-component/create-home-component');
const createPackage = require('./source/package/create-package');
const createWebpackConfig = require('./source/webpack/create-webpack-config');

const buildDirectory = path.join(__dirname, process.argv[2] || '.');

prompt(
  {
    projectName: {
      text: '✏️  Project name (kebab-case)'
    },
    authorName: {
      text: '✏️  Your full name'
    },
    authorEmail: {
      text: '💌 Your email address'
    },
    useApiHelper: {
      text: '☁️  Include API-helper?',
      type: Boolean
    },
    useMessenger: {
      text: '💬 Include message helper for API?',
      type: Boolean
    },
    useAnalyticsHelper: {
      text: '📈 Include Analytics helper?',
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
    if (!fs.existsSync(buildDirectory)) {
      fs.mkdirSync(buildDirectory);
    }

    copySync(path.join(__dirname, 'static-files'), buildDirectory, {
      filter: src => {
        const isAnalyticsFile = src.includes('js/analytics.js');
        const isMessengerFile =
          src.includes('js/messenger.js') || src.includes('components/message');
        const isIconFile =
          src.includes('components/icon') ||
          src.includes('assets/icons/icons.js');
        const isImageFile = src.includes('components/image');

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
      path.join(buildDirectory, 'webpack.config.js'),
      createWebpackConfig(useInlineSvg)
    );

    // package.json
    fs.writeFileSync(
      path.join(buildDirectory, 'package.json'),
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
      path.join(__dirname, 'source/eslintrc/.eslintrc.json'),
      path.join(buildDirectory, '.eslintrc.json')
    );

    // api-helper
    if (useApiHelper) {
      fs.writeFileSync(
        path.join(buildDirectory, 'source/js/api-helper.js'),
        createApiHelper({ useAnalyticsHelper, useMessenger })
      );
    }

    // app.jsx
    fs.writeFileSync(
      path.join(buildDirectory, 'source/mockup/app.jsx'),
      createAppComponent(projectName)
    );

    // home.jsx
    fs.writeFileSync(
      path.join(buildDirectory, 'source/mockup/pages/home.jsx'),
      createHomeComponent(projectName)
    );

    // prompt-script
    fs.copyFileSync(
      path.join(__dirname, 'utils/prompt.js'),
      path.join(buildDirectory, 'scripts/prompt.js')
    );

    // fluid-image
    const fluidImageDir = path.join(
      buildDirectory,
      'source/components/fluid-image'
    );
    fs.mkdirSync(fluidImageDir);
    fs.writeFileSync(
      path.join(fluidImageDir, 'fluid-image.jsx'),
      createFluidImage(useResponsiveImages)
    );
    fs.copyFileSync(
      path.join(__dirname, 'source/fluid-image/fluid-image.scss'),
      path.join(fluidImageDir, 'fluid-image.scss')
    );
    fs.copyFileSync(
      path.join(__dirname, 'source/fluid-image/index.js'),
      path.join(fluidImageDir, 'index.js')
    );
  }
);
