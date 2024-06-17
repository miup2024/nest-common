const fs = require('fs-extra');
const Path = require('path');
const childProcess = require('child_process');

async function cmdRun(cmd, basePath) {
  console.log(cmd);
  return new Promise(resolve => {
    const child = childProcess.exec(cmd, {
      cwd: basePath,
    });
    child.stdout.addListener('data', (data) => {
      console.log(data.toString());
    });
    child.stderr.addListener('data', (data) => {
      console.error(data.toString());
    });
    child.on('close', () => {
      resolve();
    });
  });
}

async function buildProject(dir, version, projectPath, basePath) {
  const projectBasePath = Path.join(projectPath, dir);
  const packageJsonPath = Path.join(projectBasePath, 'package.json');
  const pkg = fs.readJsonSync(packageJsonPath);
  pkg.version = version;
  fs.writeJsonSync(packageJsonPath, pkg, { spaces: 4 });
  await cmdRun(`npm run build "./libs/${dir}"`, basePath);
  await cmdRun(`npm publish --access=public`, projectBasePath);
}


async function build() {
  const projectPath = Path.join(__dirname, '../libs');
  const dirs = fs.readdirSync(projectPath);
  const basePath = Path.join(__dirname, '../');

  const version = require('../package.json').version;
  for (const dir of dirs) {
    await buildProject(dir, version, projectPath, basePath);
    console.log('build finish ', dir);
  }
}

build().then();
