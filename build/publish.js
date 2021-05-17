const fs = require('fs-extra');
const Path = require('path');
const childProcess = require('child_process');

async function buildProject(dir, version, projectPath) {
  return new Promise(resolve => {
    const projectBasePath = Path.join(projectPath, dir);
    const packageJsonPath = Path.join(projectBasePath, 'package.json');
    const pkg = fs.readJsonSync(packageJsonPath);
    pkg.version = version;
    fs.writeJsonSync(packageJsonPath, pkg, { spaces: 4 });

    let cmd = '';
    if (pkg.scripts.build) {
      cmd += 'npm run build &&';
    }
    cmd += 'npm publish --access=public';
    const child = childProcess.exec(cmd, {
      cwd: projectBasePath,
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

async function build() {
  const projectPath = Path.join(__dirname, '../libs');
  const dirs = fs.readdirSync(projectPath);

  const version = require('../package.json').version;
  for (const dir of dirs) {
    await buildProject(dir, version, projectPath);
    console.log('build finish ', dir);
  }
}

build().then();
