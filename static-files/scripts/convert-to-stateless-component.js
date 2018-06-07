/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');

const utils = require('./utils');

const getComponent = require('./get-component');

getComponent(process.argv[2], ({ componentName, filePath }) => {
  const pascalComponentName = utils.kebabToPascal(componentName);
  const fileContent = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  });

  const canConvert = utils.canConvertToStateless(fileContent);

  if (!canConvert) {
    console.log(
      `👻  Component can't be converted. Please make sure it's not already stateless and that there is no state or methods in your class.`
    );

    process.exit(1);
  }

  // Format file content because whitespace is significant in our regular expressions
  const prettyFileContent = prettier.format(
    fileContent,
    Object.assign(utils.prettierConfig, { tabWidth: 2 })
  );

  // Get render body
  const componentRegex = new RegExp(
    `class ${pascalComponentName} extends React\\.Component {((\\s{2,}.+?(?=\\n))*)\\n[}]`
  );

  if (!prettyFileContent.match(componentRegex)) {
    console.log(
      `👻  Couldn't parse component because of unexpected formatting.`
    );
    process.exit(1);
  }

  const renderRegex = new RegExp(`render\\(\\) {\\n((\\s{4,}.+?(?=\\n))*)`);
  const renderMatch = prettyFileContent.match(renderRegex);
  const renderBody = renderMatch && renderMatch[1];

  const newRenderBody = renderBody.replace(/this\.props\./g, '');

  // Get propTypes
  const propTypesRegex = new RegExp(
    `static propTypes = {\\n((\\s{4,}.+?(?=\\n))*)`
  );
  const propTypesMatch = prettyFileContent.match(propTypesRegex);
  const propTypesBody = propTypesMatch && propTypesMatch[1];

  // Get prop names
  const propNamesRegex = new RegExp(`^\\s{4}(([a-zA-Z0-9])*):`, 'gm');
  const propNamesMatch = propTypesBody && propTypesBody.match(propNamesRegex);
  const propNamesBody =
    propNamesMatch &&
    propNamesMatch.map(match => match.replace(/[\s:]/g, '')).join(',');

  // Get defaultProps
  const defaultPropsRegex = new RegExp(
    `static defaultProps = {\\n((\\s{4,}.+?(?=\\n))*)`
  );
  const defaultPropsMatch = prettyFileContent.match(defaultPropsRegex);
  const defaultPropsBody = defaultPropsMatch && defaultPropsMatch[1];

  const propNames = !propNamesBody ? '' : `{${propNamesBody}}`;

  const propTypes = !propTypesBody
    ? ''
    : `
${pascalComponentName}.propTypes = {
  ${propTypesBody}
};
`;

  const defaultProps = !defaultPropsBody
    ? ''
    : `
${pascalComponentName}.defaultProps = {
  ${defaultPropsBody}
};
`;

  const newComponentBody = `
const ${pascalComponentName} = (${propNames}) => {
  ${newRenderBody}
};

${propTypes}

${defaultProps}
`;

  const newFileContent = prettyFileContent.replace(
    componentRegex,
    newComponentBody
  );

  const newFilePrettyContent = prettier.format(
    newFileContent,
    utils.prettierConfig
  );

  fs.writeFile(filePath, newFilePrettyContent, {}, err => {
    if (err) {
      console.log(
        `👻  ${chalk.red('Error writing')} ${chalk.blueBright(
          `${componentName}.jsx`
        )}`,
        err
      );

      process.exit(1);
    }

    console.log(`🤖  ${chalk.green(`Beep boop, I'm done!`)}`);
  });
});
