'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _jss = require('./jss');

var _jss2 = _interopRequireDefault(_jss);

var _createHoc = require('./createHoc');

var _createHoc2 = _interopRequireDefault(_createHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Global index counter to preserve source order.
 * As we create the style sheet during componentWillMount lifecycle,
 * children are handled after the parents, so the order of style elements would
 * be parent->child. It is a problem though when a parent passes a className
 * which needs to override any childs styles. StyleSheet of the child has a higher
 * specificity, because of the source order.
 * So our solution is to render sheets them in the reverse order child->sheet, so
 * that parent has a higher specificity.
 *
 * @type {Number}
 */
var indexCounter = -100000;

var Container = function Container(_ref) {
  var children = _ref.children;
  return children || null;
};

/**
 * Create a `injectSheet` function that will use the passed JSS instance.
 *
 * @param {Jss} jss
 * @return {Function}
 * @api public
 */

exports['default'] = function () {
  var localJss = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _jss2['default'];
  return function injectSheet(stylesOrSheet) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.index === undefined) {
      options.index = indexCounter++;
    }
    return function () {
      var InnerComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Container;

      var Jss = (0, _createHoc2['default'])(localJss, InnerComponent, stylesOrSheet, options);
      return (0, _hoistNonReactStatics2['default'])(Jss, InnerComponent, { inner: true });
    };
  };
};