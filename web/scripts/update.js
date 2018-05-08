const path = require('path');
const fs = require('fs');
const appPath = process.cwd();
const appPackage = require(path.join(appPath, 'package.json'));
const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
const spawn = require('react-dev-utils/crossSpawn');

 // Copy over some of the devDependencies
 appPackage.dependencies = appPackage.dependencies || {};
 appPackage.devDependencies = appPackage.devDependencies || {};

 const scripts = appPackage.scripts || {};

 // Setup the script rules
 appPackage.scripts = {
   ...scripts,
   start: 'react-scripts-ts-antd start',
   build: 'react-scripts-ts-antd build',
   test: 'react-scripts-ts-antd test --env=jsdom',
   eject: 'react-scripts-ts-antd eject',
   precommit: 'lint-staged',
   'prettier-all': "prettier --write 'src/**/*' '!src/{assets,datas}/**'",
   xb: 'zdxb --'
 };

 // Setup the prettier and git hook
 appPackage.prettier = {
   'printWidth': 100,
   'singleQuote': true
 };

 appPackage['lint-staged'] = {
   '*.{ts,tsx,scss,less,md}': ['prettier --write', 'git add']
 };

 const gitProc = spawn.sync('git', ['init'], { stdio: 'inherit' });
 if (gitProc.status !== 0) {
   console.error(`git init failed, precommit script will not work. you need to reinstall husky after run git init by yourself.`);
 }

 fs.writeFileSync(
   path.join(appPath, 'package.json'),
   JSON.stringify(appPackage, null, 2)
 );

let command;
let args;
let needToInstall = [];
if (useYarn) {
  command = 'yarnpkg';
  args = ['add'];
} else {
  command = 'npm';
  args = ['install', '--save', verbose && '--verbose'].filter(e => e);
}
const { dependencies, devDependencies} = require('../config/dependencies');
const currentDependencies = appPackage.dependencies;
const currentDevDependencies = appPackage.devDependencies;
const missingDependencies = dependencies.filter(d => !currentDependencies[d]);
const missingDevDependencies = devDependencies.filter(d => !currentDevDependencies[d]);

// Install dev dependencies
if (missingDevDependencies.length > 0) {
  console.log(`Installing ${missingDevDependencies.join(', ')} as dev dependencies ${command}...`);
  console.log();
  const devProc = spawn.sync(command, args.concat('-D').concat(missingDevDependencies), { stdio: 'inherit' });
  if (devProc.status !== 0) {
    console.error(`\`${command} ${args.concat(missingDevDependencies).join(' ')}\` failed`);
  }
}
// 安装 antd, mobx 等
if (missingDependencies.length > 0) {
  console.log(`Installing ${missingDependencies.join(', ')} as dependency ${command}...`);
  console.log();
  const antProc = spawn.sync(command, args.concat(missingDependencies), { stdio: 'inherit' });
  if (antProc.status !== 0) {
    console.error(`\`${command} ${args.concat(missingDependencies).join(' ')}\` failed`);
  }
}
console.log('update finish.');