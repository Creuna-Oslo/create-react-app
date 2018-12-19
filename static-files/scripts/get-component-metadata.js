const fs = require('fs');
const path = require('path');

const frontmatter = require('./frontmatter');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;

function getComponentMetadata(filePath) {
  const folderPath = path.dirname(filePath);
  const indexFile = path.join(folderPath, 'index.js');
  const fileName = path.basename(filePath, '.jsx');
  const folderName = path.basename(folderPath);

  if (fileName === folderName && fs.existsSync(indexFile)) {
    const componentName =
      folderName[0] === folderName[0].toUpperCase()
        ? folderName
        : kebabToPascal(folderName);

    const componentFileContent = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    });

    const { data } = frontmatter(componentFileContent);
    const url = data ? data.path || folderName : folderName;
    const name = data ? data.name || componentName : componentName;
    const group = data ? data.group || 'Ungrouped' : 'Ungrouped';

    return {
      componentName,
      folderName,
      group,
      name,
      path: url.startsWith('/') ? url : '/' + url
    };
  }

  return {};
}

module.exports = getComponentMetadata;
