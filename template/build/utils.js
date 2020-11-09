const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const resolveRoot = (dir = '') => path.join(__dirname, '..', dir);

exports.cwd = cwd;

exports.resolveRoot = resolveRoot;

exports.cwdRoot = (dir = '') => path.join(cwd, dir);

exports.getPackageConfig = (key) => {
    const packagePath = exports.cwdRoot('package.json');
    let packageConfig = fs.readFileSync(packagePath, 'utf8');
    packageConfig = JSON.parse(packageConfig);
    return packageConfig[key];
};
