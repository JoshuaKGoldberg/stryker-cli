import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';

const NODE_MODULES_DIRNAME = 'node_modules';
const STRYKER_DIRNAME = 'stryker';
const BIN_DIRNAME = 'bin';
const STRYKER_FILENAME = 'stryker';

function fileExists(filePath: string) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

const baseDir = process.cwd();

const strykerPathFromNode = path.resolve(baseDir, NODE_MODULES_DIRNAME, STRYKER_DIRNAME, BIN_DIRNAME, STRYKER_FILENAME);
const strykerPathFromBuild = path.resolve(baseDir, BIN_DIRNAME, STRYKER_FILENAME);

if (fileExists(strykerPathFromNode)) {
  require(strykerPathFromNode);
} else if (fileExists(strykerPathFromBuild)) {
  require(strykerPathFromBuild);
} else {
  console.log(chalk.yellow('Stryker is currently not installed.'));
  inquirer.prompt([{ type: 'confirm', name: 'install', message: 'Do you want to automatically install Stryker?', default: 'true' }]).then((answers) => {
    if (answers['install']) {
      // Install stryker;
      require('child_process').execSync('npm i --save-dev stryker stryker-api');
      console.log(chalk.green('Stryker installation done.'));
      console.log('Get started by using ' + chalk.blue('`stryker init`') + '.');
    } else {
      console.log('I understand. You can install Stryker manually using `npm install stryker`.');
    }
  })
}

