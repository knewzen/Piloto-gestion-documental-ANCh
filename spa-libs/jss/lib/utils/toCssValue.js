'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCssValue;
var joinWithSpace = function joinWithSpace(value) {
  return value.join(' '

  /**
   * Converts array values to string.
   *
   * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
   * `border: ['1px', '2px']` > `border: 1px, 2px;`
   */
  );
};function toCssValue(value) {
  if (!Array.isArray(value)) return value;

  // Support space separated values.
  if (Array.isArray(value[0])) {
    return toCssValue(value.map(joinWithSpace));
  }

  return value.join(', ');
}