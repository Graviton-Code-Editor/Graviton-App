"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactCra = reactCra;

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("builder-util/out/fs");

  _fs = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/** @internal */
function reactCra(_x) {
  return _reactCra.apply(this, arguments);
} function _reactCra() {
  _reactCra = (0, _bluebirdLst().coroutine)(function* (projectDir) {
    if ((yield (0, _fs().statOrNull)(path.join(projectDir, "public", "electron.js"))) == null) {
      // noinspection SpellCheckingInspection
      _builderUtil().log.warn("public/electron.js not found. Please see https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3");
    }

    return {
      directories: {
        buildResources: "assets"
      },
      files: ["build/**/*"],
      extraMetadata: {
        main: "build/electron.js"
      }
    };
  });
  return _reactCra.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=rectCra.js.map