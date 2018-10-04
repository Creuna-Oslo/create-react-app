/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const prettierConfig = require('./prettier-config');

function writeFile(filePath, fileContent) {
  const fileName = filePath[filePath.length - 1];

  fs.writeFile(
    path.join.apply(null, [__dirname, ...filePath]),
    prettier.format(fileContent, prettierConfig),
    {},
    err => {
      if (!err) {
        console.log(`💾  ${chalk.blueBright(fileName)} saved`);
      } else {
        console.log(
          `👻  ${chalk.red('Error writing')} ${chalk.blueBright(fileName)}`,
          err
        );
      }
    }
  );
}

module.exports = writeFile;
