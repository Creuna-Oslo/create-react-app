/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const utils = require('./utils');
const prompt = require('./prompt');

prompt(
  {
    componentName: {
      text: 'Name of component: ',
      value: process.argv[2]
    },
    newComponentName: {
      text: 'Name of new component: ',
      value: process.argv[3]
    }
  },
  ({ componentName, newComponentName }) => {
    renameComponent(componentName, newComponentName);
  }
);

function renameComponent(componentName, newComponentName) {
  const pascalComponentName = utils.kebabToPascal(componentName);
  const pascalNewComponentName = utils.kebabToPascal(newComponentName);

  const indexFilename = 'index.js';
  const jsxFilename = `${componentName}.jsx`;
  const scssFilename = `${componentName}.scss`;

  const folderPath = path.join(
    __dirname,
    '..',
    'source',
    'components',
    componentName
  );

  const newFolderPath = path.join(
    __dirname,
    '..',
    'source',
    'components',
    newComponentName
  );

  if (!fs.existsSync(folderPath)) {
    console.log(
      `👻  Couldn't find component ${chalk.blueBright(componentName)}.`
    );

    process.exit(1);
  }

  if (fs.existsSync(newFolderPath)) {
    console.log(
      `👻  Component ${chalk.blueBright(newComponentName)} already exists.`
    );

    process.exit(1);
  }

  const jsxFileContent = fs.readFileSync(path.join(folderPath, jsxFilename), {
    encoding: 'utf-8'
  });

  // Replace Component name
  const jsxComponentRegex = new RegExp(
    `( )?${pascalComponentName}( |;|\\.)`,
    'g'
  );
  let newJsxFileContent = jsxFileContent.replace(
    jsxComponentRegex,
    `$1${pascalNewComponentName}$2`
  );

  // Replace css class names
  const jsxClassNameRegex = new RegExp(
    `("|cn\\(.*?)${componentName}("|'|-)`,
    'g'
  );
  newJsxFileContent = newJsxFileContent.replace(
    jsxClassNameRegex,
    `$1${newComponentName}$2`
  );

  fs.writeFile(
    path.join(folderPath, jsxFilename),
    prettier.format(newJsxFileContent, utils.prettierConfig),
    {},
    err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error writing')} ${chalk.blueBright(jsxFilename)}`,
          err
        );

        process.exit(1);
      }

      console.log(`${chalk.blueBright(jsxFilename)} written`);
    }
  );

  fs.writeFile(
    path.join(folderPath, indexFilename),
    prettier.format(
      `import ${pascalNewComponentName} from './${newComponentName}';
    
    export default ${pascalNewComponentName};`,
      utils.prettierConfig
    ),
    {},
    err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error writing')} ${chalk.blueBright(
            indexFilename
          )}`,
          err
        );

        process.exit(1);
      }

      console.log(`💾  ${chalk.blueBright(indexFilename)} saved`);
    }
  );

  // Overwrite index.js file with new component name
  const newJsxFilename = `${newComponentName}.jsx`;
  fs.rename(
    path.join(folderPath, jsxFilename),
    path.join(folderPath, newJsxFilename),
    err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error renaming')} ${chalk.blueBright(
            newJsxFilename
          )}`,
          err
        );

        process.exit(1);
      }

      console.log(`💾  ${chalk.blueBright(newJsxFilename)} saved`);
    }
  );

  // Rename scss file and class names if it exists
  if (fs.existsSync(path.join(folderPath, scssFilename))) {
    // Replace selectors
    const scssFileContent = fs.readFileSync(
      path.join(folderPath, scssFilename),
      {
        encoding: 'utf-8'
      }
    );
    const scssRegex = new RegExp(`\\.${componentName}( |-)`, 'g');
    const newScssFileContent = scssFileContent.replace(
      scssRegex,
      `.${newComponentName}$1`
    );

    fs.writeFile(
      path.join(folderPath, scssFilename),
      newScssFileContent,
      {},
      err => {
        if (err) {
          console.log(
            `👻  ${chalk.red('Error writing')} ${chalk.blueBright(
              scssFilename
            )}`,
            err
          );

          process.exit(1);
        }
      }
    );

    const newScssFilename = `${newComponentName}.scss`;
    fs.rename(
      path.join(folderPath, scssFilename),
      path.join(folderPath, newScssFilename),
      err => {
        if (err) {
          console.log(
            `👻  ${chalk.red('Error renaming')} ${chalk.blueBright(
              newScssFilename
            )}`,
            err
          );

          process.exit(1);
        }

        console.log(`💾  ${chalk.blueBright(newScssFilename)} saved`);
      }
    );
  }

  // Rename component folder
  fs.rename(folderPath, newFolderPath, err => {
    if (err) {
      console.log(`👻  ${chalk.red('Error renaming folder')}`, err);

      process.exit(1);
    }

    console.log(`💾 folder renamed`);
  });
}
