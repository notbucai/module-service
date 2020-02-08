const zip = require('cross-zip');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'modules')

const installModule = (zippath, modulename) => {
  const currentPath = outPath + '/' + modulename;

  const stat = fs.statSync(currentPath);

  if (!stat.isDirectory()) {
    fs.mkdirSync(currentPath);
  }

  zip.unzipSync(zippath);

}

module.exports = {
  installModule
}