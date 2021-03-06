'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require('./app');

Object.keys(_app).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _app[key];
    }
  });
});

var _alfresco = require('./alfresco');

Object.keys(_alfresco).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _alfresco[key];
    }
  });
});