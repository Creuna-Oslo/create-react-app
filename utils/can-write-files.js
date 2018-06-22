const fs = require('fs');
const path = require('path');

module.exports = function(projectPath) {
  return new Promise((resolve, reject) => {
    const isAbsolutePath =
      projectPath && (projectPath[0] === '~' || projectPath[0] === '/');

    if (isAbsolutePath) {
      return reject(
        'create-creuna-react-app does not support absolute paths. Aborting'
      );
    }

    const buildDir = path.join(process.cwd(), projectPath || '');
    const filesInBuildDir =
      fs.existsSync(buildDir) &&
      fs
        .readdirSync(buildDir)
        .filter(fileName => ['.DS_Store', '.git'].indexOf(fileName) === -1);

    if (filesInBuildDir && filesInBuildDir.length) {
      return reject(
        `There's already stuff in the current directory. Aborting
Found the following stuff:
${filesInBuildDir.map(fileName => `  ${fileName}\n`).join('')}`
      );
    }

    return resolve();
  });
};
