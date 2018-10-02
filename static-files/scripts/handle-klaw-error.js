/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');

module.exports = (err, item) => {
  console.log(
    `👻  ${chalk.red('Error walking directory on item:')} ${chalk.blueBright(
      item
    )}`,
    err
  );
  throw err;
};
