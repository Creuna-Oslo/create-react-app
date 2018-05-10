/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const kebabToHuman = require('../../utils/kebab-to-human');

module.exports = function(projectName) {
  const content = fs.readFileSync(path.join(__dirname, 'home.jsx'), {
    encoding: 'utf-8'
  });

  return content.replace('$projectName', kebabToHuman(projectName));
};
