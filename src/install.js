const zip = require('cross-zip');
const fs = require('fs-extra');
const path = require('path');

const outPath = path.join(__dirname, 'modules')

const installModule = (zippath, modulename) => {

  const modulePathObj = path.parse(modulename);
  const currentPath = outPath + '/' + modulePathObj.name;

  // const stat = fs.statSync(currentPath);

  // if (!stat.isDirectory()) {
  //   fs.mkdirSync(currentPath);
  // }

  fs.ensureDirSync(currentPath);

  zip.unzipSync(zippath, currentPath);

}

const loadModule = (modulename) => {
  const resModule = {
    options: {},
    module: null
  };
  const currentPath = outPath + '/' + modulename;
  const statModule = fs.statSync(currentPath);
  if (!statModule.isDirectory()) {
    return null;
  }

  try {
    const configPath = path.join(currentPath, 'config.json');

    const statConfig = fs.statSync(configPath);

    if (statConfig.isFile()) {
      const cinfig = require(configPath);
      resModule.module = cinfig;
    }

  } catch (error) {
    console.log('模块 [ '+modulename+' ] 不存在配置文件');
  }

  const module = require(currentPath);
  resModule.module = module;

  if (typeof resModule.module !== 'function') {
    return null;
  }
  
  return resModule;
}

module.exports = {
  loadModule,
  installModule
}