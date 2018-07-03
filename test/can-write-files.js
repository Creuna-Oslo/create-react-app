const fsExtra = require('fs-extra');
const path = require('path');
const test = require('ava');

const { canWriteFiles } = require('../index');
const paths = require('../fixtures/paths');

test('Throws on non-empty folder', async t => {
  // Create a folder inside 'dist' to make it non-empty
  await fsExtra.ensureDir(path.join(paths.build, 'something'));
  await t.throws(canWriteFiles());
});

test('Succeeds on empty folder', async t => {
  // Delete everything in 'dist' before checking if empty
  await fsExtra.emptyDir(paths.build);
  await t.notThrows(canWriteFiles('dist'));
});

test('Throws on absolute path', async t => {
  t.plan(2);
  await t.throws(canWriteFiles('/'));
  await t.throws(canWriteFiles('~'));
});
