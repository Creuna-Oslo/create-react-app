const fsExtra = require('fs-extra');
const path = require('path');
const test = require('ava');

const { canWriteFiles } = require('../index');
const getPaths = require('../fixtures/get-paths');

test('Promise rejects on non-empty folder', async t => {
  t.plan(1);
  const paths = getPaths();

  // Create a folder inside 'dist' to make it non-empty
  await fsExtra.ensureDir(path.join(paths.build, 'something'));

  return canWriteFiles(paths.build)
    .then(() => {
      t.fail('The promise should have rejected.');
    })
    .catch(error => {
      t.true(error instanceof Error);
    });
});

test('Succeeds on empty folder', async t => {
  const paths = getPaths();

  await t.notThrows(() => canWriteFiles(paths.build));
});
