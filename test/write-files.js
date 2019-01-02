const fs = require('fs');
const fsExtra = require('fs-extra');
const { serial: test } = require('ava');

const { writeFiles } = require('../index');
const getOptions = require('../fixtures/get-options');
const getPaths = require('../fixtures/get-paths');

function getPathsAndOptions() {
  const paths = getPaths();
  const options = getOptions(paths.build);

  return { paths, options };
}

test('Writes files', async t => {
  const { paths, options } = getPathsAndOptions();

  await writeFiles(options.allModules);

  const expectedFiles = [
    '.babelrc',
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.json',
    '.gitignore',
    '.prettierignore',
    'README.md',
    'browserslist',
    'codegen',
    'jsconfig.json',
    'package.json',
    'source',
    'tests',
    'webpack.config.js'
  ];

  t.deepEqual(
    expectedFiles,
    fs.readdirSync(paths.build).filter(path => path !== '.DS_Store')
  );
});

test('Writes info to package.json', async t => {
  t.plan(2);

  const { paths, options } = getPathsAndOptions();
  await writeFiles(options.allModules);
  const { name, author } = await fsExtra.readJson(paths.packageJson);

  t.is(name, 'my-project');
  t.is(author, 'John Doe <john.doe@email.com>');
});

const exists = fs.existsSync;

test('Writes optional files when selected', async t => {
  t.plan(10);

  const { paths, options } = getPathsAndOptions();
  await writeFiles(options.allModules);

  t.true(exists(paths.analytics));
  t.true(exists(paths.apiHelper));
  t.true(exists(paths.fluidImageJsx));
  t.true(exists(paths.fluidImageScss));
  t.true(exists(paths.imageJsx));
  t.true(exists(paths.imageScss));
  t.true(exists(paths.messageJsx));
  t.true(exists(paths.messageScss));
  t.true(exists(paths.messenger));
  t.true(exists(paths.responsiveImages));
});

test(`Doesn't write optional files when not selected`, async t => {
  t.plan(10);

  const { paths, options } = getPathsAndOptions();
  await writeFiles(options.noModules);

  t.false(exists(paths.analytics));
  t.false(exists(paths.apiHelper));
  t.false(exists(paths.fluidImageJsx));
  t.false(exists(paths.fluidImageScss));
  t.false(exists(paths.imageJsx));
  t.false(exists(paths.imageScss));
  t.false(exists(paths.messageJsx));
  t.false(exists(paths.messageScss));
  t.false(exists(paths.messenger));
  t.false(exists(paths.responsiveImages));
});
