'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteral(['\n          .a-id:hover {\n            color: red;\n          }\n        '], ['\n          .a-id:hover {\n            color: red;\n          }\n        ']);

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _commonTags = require('common-tags');

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _jssExtend = require('jss-extend');

var _jssExtend2 = _interopRequireDefault(_jssExtend);

var _jss = require('jss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } /* eslint-disable no-underscore-dangle */

var settings = {
  generateClassName: function generateClassName(rule) {
    return rule.name + '-id';
  }
};

describe('jss-nested', function () {
  var jss = void 0;
  var warning = void 0;

  beforeEach(function () {
    _get__('nested').__Rewire__('warning', function (condition, message) {
      warning = message;
    });

    jss = _get__('create')(_get__('settings')).use(_get__('nested')());
  });

  afterEach(function () {
    _get__('nested').__ResetDependency__('warning');
    warning = undefined;
  });

  describe('nesting with space', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '& b': { float: 'left' }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.a-id b')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.a-id b {\n' + '  float: left;\n' + '}');
    });
  });

  describe('nesting without space', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b': { float: 'left' }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.a-idb')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.a-idb {\n' + '  float: left;\n' + '}');
    });
  });

  describe('multi nesting', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b': { float: 'left' },
          '& c': { float: 'left' }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.a-idb')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.a-id c')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.a-idb {\n' + '  float: left;\n' + '}\n' + '.a-id c {\n' + '  float: left;\n' + '}');
    });
  });

  describe('multi nesting in one selector', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b, &c': { float: 'left' }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.a-idb, .a-idc')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.a-idb, .a-idc {\n' + '  float: left;\n' + '}');
    });
  });

  describe('.addRules()', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          height: '1px'
        }
      });

      sheet.addRules({
        b: {
          height: '2px',
          '& c': {
            height: '3px'
          }
        }
      });
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  height: 1px;\n' + '}\n' + '.b-id {\n' + '  height: 2px;\n' + '}\n' + '.b-id c {\n' + '  height: 3px;\n' + '}');
    });
  });

  describe('nesting in a conditional', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green'
        },
        '@media': {
          a: {
            '&:hover': { color: 'red' }
          }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  color: green;\n' + '}\n' + '@media {\n' + '  .a-id:hover {\n' + '    color: red;\n' + '  }\n' + '}');
    });
  });

  describe('nesting a conditional rule inside a regular rule', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green',
          '@media': {
            width: '200px'
          }
        },
        b: {
          color: 'red'
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('b')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  color: green;\n' + '}\n' + '@media {\n' + '  .a-id {\n' + '    width: 200px;\n' + '  }\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('order of nested conditionals', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          '@media a': {
            color: 'red'
          },
          '@media b': {
            color: 'green'
          }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('@media a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media b')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('@media a {\n' + '  .a-id {\n' + '    color: red;\n' + '  }\n' + '}\n' + '@media b {\n' + '  .a-id {\n' + '    color: green;\n' + '  }\n' + '}');
    });
  });

  describe('adding a rule with a conditional rule', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet();
      sheet.addRule('a', {
        color: 'green',
        '@media': {
          width: '200px'
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  color: green;\n' + '}\n' + '@media {\n' + '  .a-id {\n' + '    width: 200px;\n' + '  }\n' + '}');
    });
  });

  describe('do not merge nested conditional to container conditional with existing rule', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green',
          '@media': {
            width: '200px'
          },
          '@media large': {
            width: '300px'
          }
        },
        '@media': {
          b: {
            color: 'blue'
          }
        },
        c: {
          color: 'red'
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('c')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  color: green;\n' + '}\n' + '@media {\n' + '  .a-id {\n' + '    width: 200px;\n' + '  }\n' + '}\n' + '@media large {\n' + '  .a-id {\n' + '    width: 300px;\n' + '  }\n' + '}\n' + '@media {\n' + '  .b-id {\n' + '    color: blue;\n' + '  }\n' + '}\n' + '.c-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('warnings', function () {
    it('should warn when referenced rule is not found', function () {
      jss.createStyleSheet({
        a: {
          '& $b': { float: 'left' }
        }
      });

      _get__('expect')(warning).to.be('[JSS] Could not find the referenced rule %s in %s.');
    });
  });

  describe('local refs', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '& $b': { float: 'left' },
          '& $b-warn': { float: 'right' }
        },
        b: {
          color: 'red'
        },
        'b-warn': {
          color: 'orange'
        }
      });
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.a-id .b-id {\n' + '  float: left;\n' + '}\n' + '.a-id .b-warn-id {\n' + '  float: right;\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}\n' + '.b-warn-id {\n' + '  color: orange;\n' + '}');
    });
  });

  describe('nesting conditionals in combination with extend plugin', function () {
    var sheet = void 0;

    beforeEach(function () {
      var localJss = _get__('create')(_get__('settings')).use(_get__('jssExtend')(), _get__('nested')());
      sheet = localJss.createStyleSheet({
        button: {
          color: 'green',
          'background-color': 'aqua',
          '@media': {
            width: '200px'
          }
        },
        redButton: {
          extend: 'button',
          color: 'red'
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('button')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('@media')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('redButton')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.button-id {\n' + '  color: green;\n' + '  background-color: aqua;\n' + '}\n' + '@media {\n' + '  .button-id {\n' + '    width: 200px;\n' + '  }\n' + '}\n' + '.redButton-id {\n' + '  color: red;\n' + '  background-color: aqua;\n' + '}\n' + '@media {\n' + '  .redButton-id {\n' + '    width: 200px;\n' + '  }\n' + '}');
    });
  });

  describe('deep nesting', function () {
    var sheet = void 0;

    beforeEach(function () {
      var localJss = _get__('create')(_get__('settings')).use(_get__('jssExtend')(), _get__('nested')());
      sheet = localJss.createStyleSheet({
        button: {
          color: 'black',
          '& .a': {
            color: 'red',
            '& .c': {
              color: 'gold'
            }
          }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('button')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.button-id .a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.button-id .a .c')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.button-id {\n' + '  color: black;\n' + '}\n' + '.button-id .a {\n' + '  color: red;\n' + '}\n' + '.button-id .a .c {\n' + '  color: gold;\n' + '}');
    });
  });

  describe('deep nesting with multiple nestings in one selector', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        button: {
          color: 'black',
          '& .a, .b': {
            color: 'red',
            '& .c, &:hover': {
              color: 'gold'
            }
          }
        }
      });
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('button')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.button-id .a, .button-id .b')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('.button-id .a .c, .button-id .a:hover, ' + '.button-id .b .c, .button-id .b:hover')).to.not.be(undefined);
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.button-id {\n' + '  color: black;\n' + '}\n' + '.button-id .a, .button-id .b {\n' + '  color: red;\n' + '}\n' + '.button-id .a .c, .button-id .a:hover, ' + '.button-id .b .c, .button-id .b:hover {\n' + '  color: gold;\n' + '}');
    });
  });

  describe('support & at any position', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          'input:focus + &': {
            color: 'red'
          }
        }
      });
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('input:focus + .a-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('function values', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          '&:hover': {
            color: function color() {
              return 'red';
            }
          }
        }
      });
      sheet.update();
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be(_get__('stripIndent')(_templateObject));
    });
  });
});

function _getGlobalObject() {
  try {
    if (!!global) {
      return global;
    }
  } catch (e) {
    try {
      if (!!window) {
        return window;
      }
    } catch (e) {
      return this;
    }
  }
}

;
var _RewireModuleId__ = null;

function _getRewireModuleId__() {
  if (_RewireModuleId__ === null) {
    var globalVariable = _getGlobalObject();

    if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
      globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
    }

    _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
  }

  return _RewireModuleId__;
}

function _getRewireRegistry__() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
    theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
  }

  return __$$GLOBAL_REWIRE_REGISTRY__;
}

function _getRewiredData__() {
  var moduleId = _getRewireModuleId__();

  var registry = _getRewireRegistry__();

  var rewireData = registry[moduleId];

  if (!rewireData) {
    registry[moduleId] = Object.create(null);
    rewireData = registry[moduleId];
  }

  return rewireData;
}

(function registerResetAll() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable['__rewire_reset_all__']) {
    theGlobalVariable['__rewire_reset_all__'] = function () {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
    };
  }
})();

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = rewireData[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'nested':
      return _2.default;

    case 'create':
      return _jss.create;

    case 'settings':
      return settings;

    case 'expect':
      return _expect2.default;

    case 'jssExtend':
      return _jssExtend2.default;

    case 'stripIndent':
      return _commonTags.stripIndent;
  }

  return undefined;
}

function _assign__(variableName, value) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return rewireData[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  var rewireData = _getRewiredData__();

  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      rewireData[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      rewireData[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      rewireData[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  var rewireData = _getRewiredData__();

  delete rewireData[variableName];

  if (Object.keys(rewireData).length == 0) {
    delete _getRewireRegistry__()[_getRewireModuleId__];
  }

  ;
}

function _with__(object) {
  var rewireData = _getRewiredData__();

  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      rewireData[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = rewireData[variableName];
      rewireData[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
exports.default = _RewireAPI__;