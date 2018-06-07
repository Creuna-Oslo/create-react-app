/* eslint-env node */
const eslint = require('eslint');
const reactEslint = require('eslint-plugin-react');

const eslintrc = require('../.eslintrc.json');

const linter = new eslint.Linter();

linter.defineRules(
  Object.assign(
    {},
    Object.keys(reactEslint.rules).reduce((accum, key) => {
      accum[`react/${key}`] = reactEslint.rules[key];
      return accum;
    }, {})
  )
);

function kebabToPascal(s) {
  if ('string' !== typeof s || s.length === 0) return s;
  var result = s.substr(0, 1).toUpperCase(),
    i = 1,
    len = s.length;
  for (; i < len; i++)
    if (s[i] === '-' && i + 1 !== len) {
      result += s[i + 1].toUpperCase();
      i++;
    } else result += s[i].toLowerCase();
  return result[0] !== '-' ? result : result.substr(1);
}

function canConvertToStateless(jsString) {
  return !!linter.verify(jsString, {
    parser: eslintrc.parser,
    parserOptions: eslintrc.parserOptions,
    rules: {
      'react/prefer-stateless-function': 1
    }
  }).length;
}

function jsToLines(jsString) {
  return eslint.SourceCode.splitLines(jsString);
}

function findUndefinedVars(jsString) {
  return linter
    .verify(jsString, {
      parser: eslintrc.parser,
      parserOptions: eslintrc.parserOptions,
      rules: {
        'no-undef': 2
      }
    })
    .filter(message => message.ruleId === 'no-undef')
    .map(message => ({
      column: message.column - 1, // Eslint indexes start at 1
      endColumn: message.endColumn - 1,
      line: message.line - 1,
      source: message.source,
      name: message.message.match(new RegExp("^'([a-zA-Z]*)'"))[1]
    }));
}

const prettierConfig = Object.assign(
  { parser: 'babylon' },
  eslintrc.rules['prettier/prettier'][1]
);

module.exports = {
  canConvertToStateless,
  findUndefinedVars,
  jsToLines,
  kebabToPascal,
  prettierConfig
};
