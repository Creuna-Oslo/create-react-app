/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), { encoding: 'utf-8' });
}

module.exports = function(useResponsiveImages) {
  const fluidImage = readFile('fluid-image.jsx');
  const fluidImageResponsive = readFile('fluid-image-responsive.jsx');

  return useResponsiveImages ? fluidImageResponsive : fluidImage;
};
