const fsExtra = require('fs-extra');
const path = require('path');
const test = require('ava');

const { canWriteFiles } = require('../index');
const getPaths = require('../fixtures/get-paths');

test('Throws on non-empty folder', async t => {
  const paths = getPaths();

  // Create a folder inside 'dist' to make it non-empty
  await fsExtra.ensureDir(path.join(paths.build, 'something'));
  await t.throws(canWriteFiles(paths.build));
});

test('Succeeds on empty folder', async t => {
  const paths = getPaths();

  await t.notThrows(canWriteFiles(paths.build));
});
