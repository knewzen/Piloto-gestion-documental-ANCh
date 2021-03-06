'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* eslint-disable no-underscore-dangle */

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _jss = require('jss');

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('jss-compose', function () {
  var jss = void 0;
  var warning = void 0;

  beforeEach(function () {
    _get__('compose').__Rewire__('warning', function (condition, message) {
      warning = message;
    });
    jss = _get__('create')({
      generateClassName: function generateClassName(rule) {
        return rule.name + '-id';
      }
    }).use(_get__('compose')());
  });

  afterEach(function () {
    _get__('compose').__ResetDependency__('warning');
    warning = undefined;
  });

  describe('Ref composition', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: '$a',
          color: 'red'
        }
      });
    });

    afterEach(function () {
      _get__('expect')(warning).to.be(undefined);
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('b')).to.not.be(undefined);
    });

    it('should compose classes', function () {
      _get__('expect')(sheet.getRule('b').className).to.be('b-id a-id');
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('Global class composition', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          composes: 'b',
          color: 'red'
        }
      });
    });

    afterEach(function () {
      _get__('expect')(warning).to.be(undefined);
    });

    it('should add rule', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
    });

    it('should compose classes', function () {
      _get__('expect')(sheet.getRule('a').className).to.be('a-id b');
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('Array of refs composition', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          color: 'red'
        },
        c: {
          background: 'blue'
        },
        d: {
          composes: ['$a', '$b', '$c'],
          border: 'none'
        },
        e: {
          composes: '$a $b $c',
          border: 'none'
        },
        f: {
          composes: ['$a', ['$b', '$c']],
          border: 'none'
        }
      });
    });

    afterEach(function () {
      _get__('expect')(warning).to.be(undefined);
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('b')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('c')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('d')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('e')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('f')).to.not.be(undefined);
    });

    it('should compose classes', function () {
      _get__('expect')(sheet.getRule('d').className).to.be('d-id a-id b-id c-id');
      _get__('expect')(sheet.getRule('e').className).to.be('e-id a-id b-id c-id');
      _get__('expect')(sheet.getRule('f').className).to.be('f-id a-id b-id c-id');
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}\n' + '.c-id {\n' + '  background: blue;\n' + '}\n' + '.d-id {\n' + '  border: none;\n' + '}\n' + '.e-id {\n' + '  border: none;\n' + '}\n' + '.f-id {\n' + '  border: none;\n' + '}');
    });
  });

  describe('Mixed composition', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'c', 'd'],
          color: 'red'
        },
        e: {
          composes: '$a c d',
          color: 'red'
        }
      });
    });

    afterEach(function () {
      _get__('expect')(warning).to.be(undefined);
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('b')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('e')).to.not.be(undefined);
    });

    it('should compose classes', function () {
      _get__('expect')(sheet.getRule('b').className).to.be('b-id a-id c d');
      _get__('expect')(sheet.getRule('e').className).to.be('e-id a-id c d');
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}\n' + '.e-id {\n' + '  color: red;\n' + '}');
    });
  });

  describe('Nested compositions (compose composed)', function () {
    var sheet = void 0;

    beforeEach(function () {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'd'],
          color: 'red'
        },
        c: {
          composes: ['$b'],
          background: 'blue'
        }
      });
    });

    afterEach(function () {
      _get__('expect')(warning).to.be(undefined);
    });

    it('should add rules', function () {
      _get__('expect')(sheet.getRule('a')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('b')).to.not.be(undefined);
      _get__('expect')(sheet.getRule('c')).to.not.be(undefined);
    });

    it('should compose classes', function () {
      _get__('expect')(sheet.getRule('b').className).to.be('b-id a-id d');
      _get__('expect')(sheet.getRule('c').className).to.be('c-id b-id a-id d');
    });

    it('should generate correct CSS', function () {
      _get__('expect')(sheet.toString()).to.be('.a-id {\n' + '  float: left;\n' + '}\n' + '.b-id {\n' + '  color: red;\n' + '}\n' + '.c-id {\n' + '  background: blue;\n' + '}');
    });
  });

  describe('Warnings', function () {
    it('should warn when rule try to compose itself', function () {
      jss.createStyleSheet({
        a: {
          composes: ['$a'],
          color: 'red'
        }
      });
      _get__('expect')(warning).to.be('[JSS] Cyclic composition detected. \r\n%s');
    });

    it('should warn when try to compose ref which can\'t be resolved', function () {
      jss.createStyleSheet({
        a: {
          composes: ['$b'],
          color: 'red'
        }
      });
      _get__('expect')(warning).to.be('[JSS] Referenced rule is not defined. \r\n%s');
    });
  });
});

var _RewiredData__ = Object.create(null);

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
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = _RewiredData__[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'compose':
      return _2.default;

    case 'create':
      return _jss.create;

    case 'expect':
      return _expect2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
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
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      _RewiredData__[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      _RewiredData__[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
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