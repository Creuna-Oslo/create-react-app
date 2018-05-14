/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

module.exports = function({
  authorEmail,
  authorName,
  projectName,
  useMessenger
}) {
  const content = fs.readFileSync(path.join(__dirname, 'package.json'), {
    encoding: 'utf-8'
  });

  return content
    .replace('$projectName', projectName)
    .replace('$author', `${authorName} <${authorEmail}>`)
    .split(/(?:\r\n|\r|\n)/g)
    .reduce((accum, line) => {
      if (!useMessenger && line.includes('"pubsub-js":')) {
        return accum;
      }

      return accum.concat(line);
    }, [])
    .join('\n');
};
