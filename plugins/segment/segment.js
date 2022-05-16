"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ExecutionEnvironment = _interopRequireDefault(require("@docusaurus/ExecutionEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function () {
  if (!_ExecutionEnvironment.default.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate() {
      if (!window.analytics) return;
      setTimeout(() => window.analytics.page(), 0);
    }

  };
}();

exports.default = _default;