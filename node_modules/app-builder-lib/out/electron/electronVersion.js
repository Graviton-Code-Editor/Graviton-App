"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElectronVersion = getElectronVersion;
exports.getElectronVersionFromInstalled = getElectronVersionFromInstalled;
exports.computeElectronVersion = computeElectronVersion;

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

function _nodeHttpExecutor() {
  const data = require("builder-util/out/nodeHttpExecutor");

  _nodeHttpExecutor = function () {
    return data;
  };

  return data;
}

function _fsExtraP() {
  const data = require("fs-extra-p");

  _fsExtraP = function () {
    return data;
  };

  return data;
}

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function semver() {
  const data = _interopRequireWildcard(require("semver"));

  semver = function () {
    return data;
  };

  return data;
}

function _readConfigFile() {
  const data = require("read-config-file");

  _readConfigFile = function () {
    return data;
  };

  return data;
}

function _config() {
  const data = require("../util/config");

  _config = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function getElectronVersion(_x, _x2) {
  return _getElectronVersion.apply(this, arguments);
}

function _getElectronVersion() {
  _getElectronVersion = (0, _bluebirdLst().coroutine)(function* (projectDir, config, projectMetadata = new (_lazyVal().Lazy)(() => (0, _readConfigFile().orNullIfFileNotExist)((0, _fsExtraP().readJson)(path.join(projectDir, "package.json"))))) {
    if (config == null) {
      config = yield (0, _config().getConfig)(projectDir, null, null);
    }

    if (config.electronVersion != null) {
      return config.electronVersion;
    }

    return yield computeElectronVersion(projectDir, projectMetadata);
  });
  return _getElectronVersion.apply(this, arguments);
}

function getElectronVersionFromInstalled(_x3) {
  return _getElectronVersionFromInstalled.apply(this, arguments);
}
/** @internal */


function _getElectronVersionFromInstalled() {
  _getElectronVersionFromInstalled = (0, _bluebirdLst().coroutine)(function* (projectDir) {
    for (const name of ["electron", "electron-prebuilt", "electron-prebuilt-compile"]) {
      try {
        return (yield (0, _fsExtraP().readJson)(path.join(projectDir, "node_modules", name, "package.json"))).version;
      } catch (e) {
        if (e.code !== "ENOENT") {
          _builderUtil().log.warn({
            name,
            error: e
          }, `cannot read electron version package.json`);
        }
      }
    }

    return null;
  });
  return _getElectronVersionFromInstalled.apply(this, arguments);
}

function computeElectronVersion(_x4, _x5) {
  return _computeElectronVersion.apply(this, arguments);
}

function _computeElectronVersion() {
  _computeElectronVersion = (0, _bluebirdLst().coroutine)(function* (projectDir, projectMetadata) {
    const result = yield getElectronVersionFromInstalled(projectDir);

    if (result != null) {
      return result;
    }

    const electronPrebuiltDep = findFromElectronPrebuilt((yield projectMetadata.value));

    if (electronPrebuiltDep == null || electronPrebuiltDep === "latest") {
      try {
        const releaseInfo = JSON.parse((yield _nodeHttpExecutor().httpExecutor.request({
          hostname: "github.com",
          path: "/electron/electron/releases/latest",
          headers: {
            accept: "application/json"
          }
        })));
        return releaseInfo.tag_name.startsWith("v") ? releaseInfo.tag_name.substring(1) : releaseInfo.tag_name;
      } catch (e) {
        _builderUtil().log.warn(e);
      }

      throw new Error(`Cannot find electron dependency to get electron version in the '${path.join(projectDir, "package.json")}'`);
    }

    const version = semver().coerce(electronPrebuiltDep);

    if (version == null) {
      throw new Error("cannot compute electron version");
    }

    return version.toString();
  });
  return _computeElectronVersion.apply(this, arguments);
}

function findFromElectronPrebuilt(packageData) {
  for (const name of ["electron", "electron-prebuilt", "electron-prebuilt-compile"]) {
    const devDependencies = packageData.devDependencies;
    let dep = devDependencies == null ? null : devDependencies[name];

    if (dep == null) {
      const dependencies = packageData.dependencies;
      dep = dependencies == null ? null : dependencies[name];
    }

    if (dep != null) {
      return dep;
    }
  }

  return null;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=electronVersion.js.map