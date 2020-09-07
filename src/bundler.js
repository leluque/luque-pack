module.exports = {
  bundle,
};

function bundle(dependencyGraph) {
  let modules = '';

  for (moduleKey in dependencyGraph) {
    const module = dependencyGraph[moduleKey];

    // Create an object in which the attributes are the module identifiers (unique path) and the
    // values are objects with two attributes:
    // # fn - the module code inside a function (in order to isolate scope);
    // # dependencies - the module dependencies.
    modules += `'${moduleKey}': {
            fn: function(require, module, exports) {
                ${module.code}
            },
            dependencies: ${JSON.stringify(module.dependencies)},
        },
        `;
  }

  const bundleResult = `
        (function(modules) {

            function require(id) {
                console.debug('Requiring ' + id + '...');
                const {fn, dependencies} = modules[id];
                console.debug('Found ' + modules[id] + '.');

                function localRequire(relativePath) {
                    return require(dependencies[relativePath]);
                }

                const module = { exports: {} };

                console.debug('Executing the required function: ' + fn);
                
                // Pass the module and the module exports so that anything exported
                // from the required function will be available as a 'require' return.
                fn(localRequire, module, module.exports);

                console.debug('Executed.');
                console.debug('Exported:', module.exports);

                if(module.exports.default && !module.exports[module.exports.default.name]) {
                    module.exports[module.exports.default.name] = module.exports.default;
                }
                return module.exports;
            }
            
            require(0);

        })({${modules}})
    `;

  return bundleResult;
}
