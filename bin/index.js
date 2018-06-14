#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');

const blue = chalk.blueBright;
const cyan = chalk.cyan;

console.log(
  `🤗  Hey! ${blue('creuna-new')} has been deprecated. Use ${blue(
    '@creuna/cli'
  )} instead! It's much nicer.
  • ${blue('yarn global remove @creuna/create-react-app')} or ${cyan(
    'npm uninstall -g @creuna/create-react-app'
  )}
  • ${blue('yarn global add @creuna/cli')} or ${cyan(
    'npm install -g @creuna/cli'
  )}
  • ${blue('creuna')}
  `
);
