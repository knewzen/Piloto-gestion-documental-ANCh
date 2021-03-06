'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findRenderer;

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _DomRenderer = require('../backends/DomRenderer');

var _DomRenderer2 = _interopRequireDefault(_DomRenderer);

var _VirtualRenderer = require('../backends/VirtualRenderer');

var _VirtualRenderer2 = _interopRequireDefault(_VirtualRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 */
function findRenderer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.Renderer) return options.Renderer;
  var useVirtual = options.virtual || !_isInBrowser2['default'];
  return useVirtual ? _VirtualRenderer2['default'] : _DomRenderer2['default'];
}