// Paths for tests
const path = require('path');

const { join } = path;
const buildPath = join(process.cwd(), 'dist');
const componentsPath = join(buildPath, 'source', 'components');
const jsPath = join(buildPath, 'source', 'js');

module.exports = {
  analytics: join(jsPath, 'analytics.js'),
  apiHelper: join(jsPath, 'api-helper.js'),
  build: buildPath,
  fluidImageJsx: join(componentsPath, 'fluid-image', 'fluid-image.jsx'),
  fluidImageScss: join(componentsPath, 'fluid-image', 'fluid-image.scss'),
  imageJsx: join(componentsPath, 'image', 'image.jsx'),
  imageScss: join(componentsPath, 'image', 'image.scss'),
  packageJson: join(buildPath, 'package.json'),
  messageJsx: join(componentsPath, 'message', 'message.jsx'),
  messageScss: join(componentsPath, 'message', 'message.scss'),
  messenger: join(jsPath, 'messenger.js'),
  responsiveImages: join(jsPath, 'responsive-images.js')
};
