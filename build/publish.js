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
async function copyProjectFile(dir, version, projectPath, basePath) {

}
async function buildProject(dir, version, projectPath,buildPath, basePath) {
  const projectBasePath = Path.join(projectPath, dir);
  const projectOutPath = Path.join(buildPath, dir);
  await cmdRun(`nest build ${dir}`, basePath);

  const files = ['package.json', 'README.md', '.npmignore'];
  await fs.ensureDir(projectOutPath);
  for (const file of files) {
    try {
      const srcPath = Path.join(projectBasePath, file);
      const distPath = Path.join(projectOutPath, file);
      await fs.copy(srcPath, distPath);
    } catch (e) {
      console.log(e);
    }
  }
  const packageJsonPath = Path.join(projectOutPath, 'package.json');
  const pkg = fs.readJsonSync(packageJsonPath);
  pkg.version = version;
  fs.writeJsonSync(packageJsonPath, pkg, { spaces: 4 });
  await cmdRun(`npm publish --access=public`, projectOutPath);
}

async function build() {
  const projectPath = Path.join(__dirname, '../libs');
  const buildPath = Path.join(__dirname, '../dist/libs');
  const dirs = fs.readdirSync(projectPath);
  const basePath = Path.join(__dirname, '../');

  const version = require('../package.json').version;
  for (const dir of dirs) {
    await buildProject(dir, version, projectPath,buildPath, basePath);
    console.log('build finish ', dir);
  }
}

build().then();
