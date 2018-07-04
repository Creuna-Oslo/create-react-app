const chalk = require('chalk');
const fs = require('fs');

module.exports = function(projectPath) {
  return new Promise((resolve, reject) => {
    const filesInProjectPath =
      fs.existsSync(projectPath) &&
      fs
        .readdirSync(projectPath)
        .filter(fileName => ['.DS_Store', '.git'].indexOf(fileName) === -1);

    if (filesInProjectPath && filesInProjectPath.length) {
      return reject(
        `There's already stuff in the current directory.
Found the following stuff in ${chalk.blueBright(projectPath)}:
${filesInProjectPath.map(fileName => `  ${fileName}\n`).join('')}`
      );
    }

    return resolve();
  });
};
