const path = require('path');
const fs = require('fs');
var beautify = require('js-beautify').js;

const { loadConfiguration } = require('./configurationLoader');
const graph = require('./graph');
const bundler = require('./bundler');

// Load the configuration.
const config = loadConfiguration();

// Generate the dependency graph.
const dependencyGraph = graph.createDependencyGraph(config.entry);

// Generate the bundle.
let bundleResult = bundler.bundle(dependencyGraph);
if (config[beautify]) {
  bundleResult = beautify(bundleResult, {
    indent_size: 2,
    space_in_empty_paren: true,
  });
}

// Write the output file.
const bundlePath = path.join(config.output.path, config.output.filename);
fs.mkdir(config.output.path, { recursive: true }, (err) => {
  if (err) console.log(`Error creating directory: ${err}`);
});
fs.writeFile(bundlePath, bundleResult, 'utf-8', (err) => {
  if (err) return console.log(err);
  console.debug('Bundle was generated.');
});
