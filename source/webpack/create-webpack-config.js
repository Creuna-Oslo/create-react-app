/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const eslintrc = require('../../.eslintrc.json');

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), { encoding: 'utf-8' });
}

module.exports = function(useInlineSvg) {
  const baseConfig = readFile('webpack.config.js');
  const assetsRules = readFile('assets-rules.js');
  const assetsRulesSvg = readFile('assets-rules-inline-svg.js');

  const newFileContent = prettier.format(
    baseConfig.replace(
      '$assetRules',
      useInlineSvg ? assetsRulesSvg : assetsRules
    ),
    eslintrc.rules['prettier/prettier'][1]
  );

  return newFileContent;
};
