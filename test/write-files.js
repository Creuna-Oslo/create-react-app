const fs = require('fs');
const fsExtra = require('fs-extra');
const test = require('ava');

const { writeFiles } = require('../index');
const options = require('../fixtures/options');
const paths = require('../fixtures/paths');

test('Writes files', async t => {
  t.plan(2);
  await fsExtra.emptyDir(paths.build);
  await t.notThrows(writeFiles(options.allModules));
  t.snapshot(fs.readdirSync(paths.build).filter(path => path !== '.DS_Store'));
});

test('Writes info to package.json', async t => {
  t.plan(2);

  const { name, author } = await fsExtra.readJson(paths.packageJson);

  t.is(name, 'my-project');
  t.is(author, 'John Doe <john.doe@email.com>');
});

const exists = fs.existsSync;

test('Writes optional files when selected', async t => {
  t.plan(10);

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

  await fsExtra.emptyDir(paths.build);
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
