/* eslint-env node */
// NOTE: This file is run pre build and creates files needed to build the static site.
const path = require('path');
const { createPagesFile, createPathsFile } = require('@creuna/codegen');

const eslintConfig = require('../.eslintrc.json');

const disclaimers = [
  '// NOTE: Do not edit this file. It is built by running `/codegen/pages.js`'
].join('\n');

const staticSitePath = path.join(__dirname, '..', 'source', 'static-site');

const commonOptions = {
  searchPath: path.join(staticSitePath, 'pages'),
  fileHeader: disclaimers,
  outputPath: staticSitePath,
  prettierOptions: eslintConfig.rules['prettier/prettier'][1]
};

createPagesFile(Object.assign({}, commonOptions, { fileName: 'pages.js' }));
createPathsFile(Object.assign({}, commonOptions, { fileName: 'paths.js' }));
