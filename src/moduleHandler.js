const fs = require('fs');
const babel = require('babel-core');
const { default: traverse } = require('babel-traverse');
const babylon = require('babylon');
const { createSequence } = require('./messageUtil');
const { debug } = require('./messageUtil');

module.exports = {
  handleAsset,
};

function handleAsset(filePath) {
  debug(`Handling asset ${filePath}...`);

  const entryContent = _readAsset(filePath);
  const entryAST = _generateAST(entryContent);
  const dependencies = _getImportDeclarations(entryAST);
  const code = _transformCode(entryAST);

  return {
    filePath,
    code,
    dependencies,
  };
}

function _readAsset(filePath) {
  if (filePath.lastIndexOf('.') < 0) {
    filePath = filePath + '.js';
  }
  
  debug(`Reading module ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  debug(`The module was read.`);
  return content;
}

function _generateAST(fileContent) {
  debug(`Generating an Abstract Syntax Tree (AST) for the module content...`);
  const ast = babylon.parse(fileContent, {
    sourceType: 'module',
  });
  debug(`The AST was generated`);
  return ast;
}

function _getImportDeclarations(ast) {
  debug(`Finding import declarations from the AST...`);
  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });
  debug(`The import declarations were found.`);
  return dependencies;
}

function _transformCode(ast) {
  debug(`Transforming code using Babel...`);
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['env'], // In order to run in 'almost' every popular browser.
  });
  debug(`The code was transformed.`);
  return code;
}
