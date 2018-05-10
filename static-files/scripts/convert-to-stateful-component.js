/* eslint-env node */
/* eslint-disable no-console */
const babel = require('babel-core');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const utils = require('./utils');
const eslintrc = require('../.eslintrc.json');

const getComponent = require('./get-component');

getComponent(process.argv[2], ({ componentName, filePath }) => {
  const pascalComponentName = utils.kebabToPascal(componentName);
  const fileContent = fs.readFileSync(path.join(filePath), {
    encoding: 'utf-8'
  });

  // Format file content because whitespace is significant in our regular expressions
  const prettyFileContent = prettier.format(
    fileContent,
    Object.assign({}, eslintrc.rules['prettier/prettier'][1], { tabWidth: 2 })
  );

  // Get render body
  const componentRegex = new RegExp(
    `(const ${pascalComponentName} = \\(([^)]*)\\) => [({\\n])((\\s{2,}.+?(?=\\n))*)\\n[})];`
  );
  const componentMatch = prettyFileContent.match(componentRegex);

  if (!componentMatch) {
    console.log(
      `👻  Couldn't parse component because of unexpected formatting`
    );
    process.exit(1);
  }

  const renderBody = componentMatch && componentMatch[3];
  const hasReturnStatement = renderBody && renderBody.match(/^\s{2}return/gm);

  const propNamesMatch = componentMatch && componentMatch[2];
  const propNamesString = propNamesMatch.replace(/[{}\s]/g, '');
  const propNames = propNamesString.split(',');

  const renderBodyWithReturn = hasReturnStatement
    ? renderBody
    : `
return (
  ${renderBody}
);`;

  // Transform object shorthand properties, because they will cause trouble when adding 'this.props.' befor prop names later on. We have to add a dummy function wrapping the render method or else babel will crash.
  const transformedRenderBody = babel.transform(
    'function whatever() {' + renderBodyWithReturn + '}',
    {
      plugins: [
        'transform-es2015-shorthand-properties',
        'syntax-object-rest-spread',
        'syntax-jsx'
      ]
    }
  );
  const transformedRenderBodyLines = utils.jsToLines(
    transformedRenderBody.code
  );

  // Remove dummy function wrapper we added before
  const newRenderBody = transformedRenderBodyLines.slice(1, -1).join('\n');

  // Get propTypes
  const propTypesRegex = new RegExp(
    `(${pascalComponentName}.propTypes = {)((\\s{2,}.+?(?=\\n))*)\\n};`
  );
  const propTypesMatch = prettyFileContent.match(propTypesRegex);
  const propTypesBody = propTypesMatch && propTypesMatch[2];

  // Get defaultProps
  const defaultPropsRegex = new RegExp(
    `(${pascalComponentName}.defaultProps = {)((\\s{2,}.+?(?=\\n))*)\\n};`
  );
  const defaultPropsMatch = prettyFileContent.match(defaultPropsRegex);
  const defaultPropsBody = defaultPropsMatch && defaultPropsMatch[2];

  const propTypes = !propTypesBody
    ? ''
    : `
static propTypes = {
  ${propTypesBody}
};
`;

  const defaultProps = !defaultPropsBody
    ? ''
    : `
static defaultProps = {
  ${defaultPropsBody}
};
`;

  const newComponentBody = `
class ${pascalComponentName} extends React.Component {
  ${propTypes}

  ${defaultProps}

  render() {
    ${newRenderBody}
  }
}
`;

  const temporaryNewFileContent = prettyFileContent
    .replace(componentRegex, newComponentBody)
    .replace(propTypesRegex, '')
    .replace(defaultPropsRegex, '');

  // Insert 'this.props.' before all undefined variables in render using eslint
  const undefinedVars = utils.findUndefinedVars(temporaryNewFileContent);

  const newFileLines = utils.jsToLines(temporaryNewFileContent);

  const newFileContent = newFileLines.reduce((accum, line, index) => {
    // Check if eslint has found one or more undefined variable errors on this line
    const maybeUndefinedVars = undefinedVars.filter(
      variable => variable.line === index
    );

    if (maybeUndefinedVars.length) {
      const correctedLine = maybeUndefinedVars.reduce(
        (accum, { column, endColumn, name }, index) => {
          const isPropName = propNames.indexOf(name) !== -1;

          if (isPropName) {
            // Because inserting 'this.props.' is increasing the length of the string, we need to offset the column indexes accordingly
            const indexOffset = index * 'this.props.'.length;
            const textBefore = accum.substring(0, column + indexOffset);
            const textAfter = accum.substring(
              endColumn + indexOffset,
              accum.length + indexOffset
            );
            return textBefore + 'this.props.' + name + textAfter;
          }

          return accum;
        },
        line
      );

      return accum + correctedLine + '\n';
    }

    return accum + line + '\n';
  }, '');

  const newFilePrettyContent = prettier.format(
    newFileContent,
    eslintrc.rules['prettier/prettier'][1]
  );

  fs.writeFile(path.join(filePath), newFilePrettyContent, {}, err => {
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
