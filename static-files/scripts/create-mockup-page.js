/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const createjsxFileContents = require('./create-mockup-jsx-file-contents');
const prompt = require('./prompt');
const utils = require('./utils');

prompt(
  {
    componentName: { text: 'Name of page', value: process.argv[2] },
    humanReadableName: {
      optional: true,
      text: 'Human readable name (optional)',
      value: process.argv[3]
    }
  },
  ({ componentName, humanReadableName }) => {
    createMockupPage(componentName, humanReadableName);
  }
);

function createMockupPage(componentName, humanReadableName) {
  const folderPath = path.join(
    __dirname,
    '..',
    'source',
    'mockup',
    'pages',
    componentName
  );
  const indexFilename = 'index.js';
  const jsonFilename = `${componentName}.json`;
  const jsxFilename = `${componentName}.jsx`;
  const pascalComponentName = utils.kebabToPascal(componentName);

  if (fs.existsSync(folderPath)) {
    console.log(
      `👻  A folder named ${chalk.blueBright(componentName)} already exists.`
    );

    process.exit(1);
  }

  console.log(`⚙️  Generating ${chalk.blueBright(componentName)}`);

  fs.mkdir(folderPath, err => {
    if (err) {
      console.log(
        `👻  ${chalk.red('Error creating directory')} ${chalk.blueBright(
          `./source/components/${componentName}`
        )}`,
        err
      );

      process.exit(1);
    }

    fs.writeFile(
      path.join(folderPath, jsxFilename),
      prettier.format(
        createjsxFileContents(
          componentName,
          pascalComponentName,
          humanReadableName
        ),
        utils.prettierConfig
      ),
      {},
      err => {
        if (err) {
          console.log(
            `👻  ${chalk.red('Error writing')} ${chalk.blueBright(
              jsxFilename
            )}`,
            err
          );

          process.exit(1);
        }

        console.log(`💾  ${chalk.blueBright(jsxFilename)} saved`);
      }
    );

    fs.writeFile(path.join(folderPath, jsonFilename), '{}', {}, err => {
      if (err) {
        console.log(
          `👻  ${chalk.red('Error writing')} ${chalk.blueBright(jsonFilename)}`,
          err
        );

        process.exit(1);
      }

      console.log(`💾  ${chalk.blueBright(jsonFilename)} saved`);
    });

    fs.writeFile(
      path.join(folderPath, indexFilename),
      prettier.format(
        `import ${pascalComponentName} from './${componentName}'; export default ${pascalComponentName};`,
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
  });
}
