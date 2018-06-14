/* eslint-env node */
const eslintrc = require('../.eslintrc.json');

module.exports = Object.assign(
  { parser: 'babylon' },
  eslintrc.rules['prettier/prettier'][1]
);