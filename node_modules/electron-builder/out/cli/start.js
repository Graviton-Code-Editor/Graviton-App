"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

/** @internal */
function start() {
  return _start.apply(this, arguments);
} function _start() {
  _start = (0, _bluebirdLst().coroutine)(function* () {
    require("electron-webpack/dev-runner");
  });
  return _start.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=start.js.map