/* eslint-env node */
const fs = require('fs');
const path = require('path');

const kebabToHuman = require('../../utils/kebab-to-human');

module.exports = function({ projectName }) {
  const content = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8');

  return `# ${kebabToHuman(projectName)}\n` + content;
};
