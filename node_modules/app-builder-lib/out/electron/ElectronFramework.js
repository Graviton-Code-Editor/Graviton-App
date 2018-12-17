"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElectronFrameworkSupport = createElectronFrameworkSupport;

function _bluebirdLst() {
  const data = _interopRequireWildcard(require("bluebird-lst"));

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

function _index() {
  const data = require("../index");

  _index = function () {
    return data;
  };

  return data;
}

function _pathManager() {
  const data = require("../util/pathManager");

  _pathManager = function () {
    return data;
  };

  return data;
}

function _electronMac() {
  const data = require("./electronMac");

  _electronMac = function () {
    return data;
  };

  return data;
}

function _electronVersion() {
  const data = require("./electronVersion");

  _electronVersion = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function createDownloadOpts(opts, platform, arch, electronVersion) {
  return Object.assign({
    platform,
    arch,
    version: electronVersion
  }, opts.electronDownload);
}

function beforeCopyExtraFiles(_x, _x2) {
  return _beforeCopyExtraFiles.apply(this, arguments);
}

function _beforeCopyExtraFiles() {
  _beforeCopyExtraFiles = (0, _bluebirdLst().coroutine)(function* (options, isClearExecStack) {
    const packager = options.packager;
    const appOutDir = options.appOutDir;

    if (packager.platform === _index().Platform.LINUX) {
      const linuxPackager = packager;
      const executable = path.join(appOutDir, linuxPackager.executableName);
      yield (0, _fsExtraP().rename)(path.join(appOutDir, packager.electronDistExecutableName), executable);

      if (isClearExecStack) {
        try {
          yield (0, _builderUtil().executeAppBuilder)(["clear-exec-stack", "--input", executable]);
        } catch (e) {
          _builderUtil().log.debug({
            error: e
          }, "cannot clear exec stack");
        }
      }
    } else if (packager.platform === _index().Platform.WINDOWS) {
      const executable = path.join(appOutDir, `${packager.appInfo.productFilename}.exe`);
      yield (0, _fsExtraP().rename)(path.join(appOutDir, `${packager.electronDistExecutableName}.exe`), executable);
    } else {
      yield (0, _electronMac().createMacApp)(packager, appOutDir, options.asarIntegrity, options.platformName === "mas");
      const wantedLanguages = (0, _builderUtil().asArray)(packager.platformSpecificBuildOptions.electronLanguages);

      if (wantedLanguages.length === 0) {
        return;
      } // noinspection SpellCheckingInspection


      const langFileExt = ".lproj";
      const resourcesDir = packager.getResourcesDir(appOutDir);
      yield _bluebirdLst().default.map((0, _fsExtraP().readdir)(resourcesDir), file => {
        if (!file.endsWith(langFileExt)) {
          return;
        }

        const language = file.substring(0, file.length - langFileExt.length);

        if (!wantedLanguages.includes(language)) {
          return (0, _fsExtraP().remove)(path.join(resourcesDir, file));
        }

        return;
      }, _fs().CONCURRENCY);
    }
  });
  return _beforeCopyExtraFiles.apply(this, arguments);
}

class ElectronFramework {
  constructor(name, version, distMacOsAppName) {
    this.name = name;
    this.version = version;
    this.distMacOsAppName = distMacOsAppName; // noinspection JSUnusedGlobalSymbols

    this.macOsDefaultTargets = ["zip", "dmg"]; // noinspection JSUnusedGlobalSymbols

    this.defaultAppIdPrefix = "com.electron."; // noinspection JSUnusedGlobalSymbols

    this.isCopyElevateHelper = true; // noinspection JSUnusedGlobalSymbols

    this.isNpmRebuildRequired = true;
  }

  getDefaultIcon(platform) {
    if (platform === _index().Platform.LINUX) {
      return path.join((0, _pathManager().getTemplatePath)("icons"), "electron-linux");
    } else {
      // default icon is embedded into app skeleton
      return null;
    }
  }

  prepareApplicationStageDirectory(options) {
    return unpack(options, createDownloadOpts(options.packager.config, options.platformName, options.arch, this.version), this.distMacOsAppName);
  }

  beforeCopyExtraFiles(options) {
    return beforeCopyExtraFiles(options, this.name === "electron" && semver().lte(this.version || "1.8.3", "1.8.3"));
  }

}

class MuonFramework extends ElectronFramework {
  constructor(version) {
    super("muon", version, "Brave.app");
  }

  prepareApplicationStageDirectory(options) {
    return unpack(options, Object.assign({
      mirror: "https://github.com/brave/muon/releases/download/v",
      customFilename: `brave-v${options.version}-${options.platformName}-${options.arch}.zip`,
      isVerifyChecksum: false
    }, createDownloadOpts(options.packager.config, options.platformName, options.arch, options.version)), this.distMacOsAppName);
  }

}

function createElectronFrameworkSupport(_x3, _x4) {
  return _createElectronFrameworkSupport.apply(this, arguments);
}

function _createElectronFrameworkSupport() {
  _createElectronFrameworkSupport = (0, _bluebirdLst().coroutine)(function* (configuration, packager) {
    if (configuration.muonVersion != null) {
      return new MuonFramework(configuration.muonVersion);
    }

    let version = configuration.electronVersion;

    if (version == null) {
      // for prepacked app asar no dev deps in the app.asar
      if (packager.isPrepackedAppAsar) {
        version = yield (0, _electronVersion().getElectronVersionFromInstalled)(packager.projectDir);

        if (version == null) {
          throw new Error(`Cannot compute electron version for prepacked asar`);
        }
      } else {
        version = yield (0, _electronVersion().computeElectronVersion)(packager.projectDir, new (_lazyVal().Lazy)(() => Promise.resolve(packager.metadata)));
      }

      configuration.electronVersion = version;
    }

    return new ElectronFramework("electron", version, "Electron.app");
  });
  return _createElectronFrameworkSupport.apply(this, arguments);
}

function unpack(_x5, _x6, _x7) {
  return _unpack.apply(this, arguments);
}

function _unpack() {
  _unpack = (0, _bluebirdLst().coroutine)(function* (prepareOptions, options, distMacOsAppName) {
    const packager = prepareOptions.packager;
    const out = prepareOptions.appOutDir;
    let dist = packager.config.electronDist;

    if (dist != null) {
      const zipFile = `electron-v${options.version}-${prepareOptions.platformName}-${options.arch}.zip`;
      const resolvedDist = path.resolve(packager.projectDir, dist);

      if ((yield (0, _fs().statOrNull)(path.join(resolvedDist, zipFile))) != null) {
        options.cache = resolvedDist;
        dist = null;
      }
    }

    let isFullCleanup = false;

    if (dist == null) {
      yield (0, _builderUtil().executeAppBuilder)(["unpack-electron", "--configuration", JSON.stringify([options]), "--output", out, "--distMacOsAppName", distMacOsAppName]);
    } else {
      isFullCleanup = true;
      const source = packager.getElectronSrcDir(dist);
      const destination = packager.getElectronDestinationDir(out);

      _builderUtil().log.info({
        source,
        destination
      }, "copying Electron");

      yield (0, _fsExtraP().emptyDir)(out);
      yield (0, _fs().copyDir)(source, destination, {
        isUseHardLink: _fs().DO_NOT_USE_HARD_LINKS
      });
    }

    yield cleanupAfterUnpack(prepareOptions, distMacOsAppName, isFullCleanup);
  });
  return _unpack.apply(this, arguments);
}

function cleanupAfterUnpack(prepareOptions, distMacOsAppName, isFullCleanup) {
  const out = prepareOptions.appOutDir;

  const isMac = prepareOptions.packager.platform === _index().Platform.MAC;

  const resourcesPath = isMac ? path.join(out, distMacOsAppName, "Contents", "Resources") : path.join(out, "resources");
  return Promise.all([isFullCleanup ? (0, _fs().unlinkIfExists)(path.join(resourcesPath, "default_app.asar")) : Promise.resolve(), isFullCleanup ? (0, _fs().unlinkIfExists)(path.join(out, "version")) : Promise.resolve(), isMac ? Promise.resolve() : (0, _fsExtraP().rename)(path.join(out, "LICENSE"), path.join(out, "LICENSE.electron.txt")).catch(() => {})]);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=ElectronFramework.js.map