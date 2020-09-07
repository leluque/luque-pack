const moduleHandler = require('./moduleHandler');
const path = require('path');
const { debug } = require('./messageUtil');

module.exports = {
  createDependencyGraph,
};

function createDependencyGraph(entryPath) {
  debug(`Creating dependency graph...`);
  const dependencyGraph = {};

  const entryAssetObject = moduleHandler.handleAsset(entryPath);
  const assetsQueue = [entryAssetObject];

  dependencyGraph[0] = entryAssetObject;

  for (let queuedAssetObject of assetsQueue) {
    debug(`Handling asset ${queuedAssetObject.filePath}...`, (level = 2));
    dependencyGraph[queuedAssetObject.filePath] = queuedAssetObject;

    const assetDirname = path.dirname(queuedAssetObject.filePath);

    const dependencyArray = queuedAssetObject.dependencies;
    queuedAssetObject.dependencies = {};

    debug(`Handling dependencies...`, 2);
    for (let dependency of dependencyArray) {
      const dependencyPath = path.join(assetDirname, dependency);

      if (dependencyGraph[dependencyPath]) {
        queuedAssetObject.dependencies[dependency] =
          dependencyGraph[dependencyPath].filePath;
      } else {
        const dependencyAsset = moduleHandler.handleAsset(dependencyPath);

        assetsQueue.push(dependencyAsset);

        queuedAssetObject.dependencies[dependency] = dependencyAsset.filePath;
      }
    }
  }
  debug(`The dependency graph was created.`);
  return dependencyGraph;
}