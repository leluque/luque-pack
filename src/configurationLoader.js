const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { debug } = require('./messageUtil');

module.exports = {
  loadConfiguration,
};

function loadConfiguration() {
  program
    .version('0.0.1')
    .option(
      '-c, --config <path>',
      'specify the path to the config file',
      'luquepack.config.js',
    );
  program.parse(process.argv);

  debug(`Running LuquePack with config file '${program.config}'...`);

  if (fs.existsSync(program.config)) {
    const relativePathToConfigFile = path.relative(
      __dirname,
      path.join(process.cwd(), program.config),
    );
    const moduleName = relativePathToConfigFile.substring(
      0,
      relativePathToConfigFile.lastIndexOf('.'),
    );
    debug(`Loading module '${moduleName}'...`, 2);
    var config = require(moduleName);
  } else {
    debug(`The configuration file '${program.config}' hasn't been found.`, 2);
    var config = require('./luquepack.default.config');
  }
  debug(`Using config:`);
  debug(config);
  return config;
}

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, 'utf-8', function (err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}
