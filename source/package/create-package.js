/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

module.exports = function({
  authorEmail,
  authorName,
  projectName,
  useInlineSvg,
  useMessenger
}) {
  const content = fs.readFileSync(path.join(__dirname, 'package.json'), {
    encoding: 'utf-8'
  });

  return content
    .replace('$projectName', projectName)
    .replace('$author', `${authorName} <${authorEmail}>`)
    .split('\n')
    .reduce((accum, line) => {
      if (!useMessenger && line.includes('"pubsub-js":')) {
        return accum;
      }

      if (
        !useInlineSvg &&
        (line.includes('"svg-react-loader":') ||
          line.includes('"svgo":') ||
          line.includes('"svgo-loader":'))
      ) {
        return accum;
      }

      return accum.concat(line);
    }, [])
    .join('\n');
};
