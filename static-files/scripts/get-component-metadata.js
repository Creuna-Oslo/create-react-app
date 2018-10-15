const fs = require('fs');
const path = require('path');

const frontmatter = require('./frontmatter');
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;

function getComponentMetadata(item) {
  const slugs = item.path.split(path.sep);
  const folderSlugs = slugs.slice(0, slugs.length - 1);
  const indexFile = folderSlugs.concat('index.js').join(path.sep);
  const fileName = slugs[slugs.length - 1].replace('.jsx', '');
  const folderName = slugs[slugs.length - 2];

  if (fileName === folderName && fs.existsSync(indexFile)) {
    const componentName =
      folderName[0] === folderName[0].toUpperCase()
        ? folderName
        : kebabToPascal(slugs[slugs.length - 2]);

    const componentFileContent = fs.readFileSync(slugs.join(path.sep), {
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
      path: url.startsWith('/') ? url : '/' + url,
      slugs
    };
  }

  return {};
}

module.exports = getComponentMetadata;
