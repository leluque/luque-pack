(function (modules) {
  function require(id) {
    console.debug('Requiring ' + id + '...');
    const { fn, dependencies } = modules[id];
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

    if (
      module.exports.default &&
      !module.exports[module.exports.default.name]
    ) {
      module.exports[module.exports.default.name] = module.exports.default;
    }
    return module.exports;
  }

  require(0);
})({
  0: {
    fn: function (require, module, exports) {
      'use strict';

      var _example = require('./example1');

      console.log('targetIndex.js');
      (0, _example.example1)();
    },
    dependencies: { './example1': 'example/example1' },
  },
  './example/index.js': {
    fn: function (require, module, exports) {
      'use strict';

      var _example = require('./example1');

      console.log('targetIndex.js');
      (0, _example.example1)();
    },
    dependencies: { './example1': 'example/example1' },
  },
  'example/example1': {
    fn: function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.default = example1;

      var _example = require('./subFolder/example2');

      var _example2 = require('./subFolder/example3');

      function example1() {
        console.log('targetUtil1.js');

        (0, _example.example2)();
        (0, _example2.example3)();
      }
    },
    dependencies: {
      './subFolder/example2': 'example/subFolder/example2',
      './subFolder/example3': 'example/subFolder/example3',
    },
  },
  'example/subFolder/example2': {
    fn: function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.default = example2;
      function example2() {
        console.log('targetUtil2.js');
      }
    },
    dependencies: {},
  },
  'example/subFolder/example3': {
    fn: function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.default = example3;
      function example3() {
        console.log('targetUtil3.js');
      }
    },
    dependencies: {},
  },
});
