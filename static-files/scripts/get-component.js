/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const prompt = require('./prompt');

function isFullPath(inputPath) {
  const slugs = inputPath.split(path.sep);
  const dirnameSlugs = __dirname.split(path.sep);

  return slugs && slugs[1] === dirnameSlugs[1];
}

// This function accepts one of the following:
//    * A full path to a jsx file. In this case, the path will be returned as is.
//    * A path relative to source/components (without file extension).
//      Example: "folder/comp" will result in "source/components/folder/comp.jsx" if
//      it exists. If not, "source/components/folder/comp/comp.jsx" will be attempted.

module.exports = function getComponent(componentPath, callback) {
  prompt(
    {
      componentPath: {
        text: '✏️  Name of component',
        value: componentPath
      }
    },
    ({ componentPath }) => {
      parse(componentPath);
    }
  );

  function parse(componentPath) {
    if (isFullPath(componentPath)) {
      const slugs = componentPath.split(path.sep);
      const fileName = slugs[slugs.length - 1];

      resolve({
        componentName: fileName.replace(/.jsx$/, ''),
        filePath: componentPath,
        folderPath: componentPath.replace(new RegExp(`${fileName}$`), '')
      });
      return;
    }

    const slugs = componentPath.split('/');
    const componentName = slugs[slugs.length - 1];
    const fileName = `${componentName}.jsx`;
    const componentsPath = path.join(__dirname, '..', 'source', 'components');
    const pathWithoutComponentName = path.join(
      componentsPath,
      ...slugs.slice(0, slugs.length - 1)
    );

    // Attemt to use last slug as component name
    if (fs.existsSync(path.join(pathWithoutComponentName, fileName))) {
      resolve({
        componentName,
        filePath: path.join(pathWithoutComponentName, fileName),
        folderPath: pathWithoutComponentName
      });
      return;
    }

    const folderPath = path.join(componentsPath, ...slugs);
    const filePath = path.join(folderPath, fileName);

    resolve({ componentName, filePath, folderPath });
  }

  function resolve({ componentName, filePath, folderPath }) {
    if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
      console.log(
        `👻  Couldn't find component ${chalk.blueBright(componentName)}.`
      );
      process.exit(1);
    }

    callback({ componentName, filePath, folderPath });
  }
};
