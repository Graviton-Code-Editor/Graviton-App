"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibUiFramework = void 0;

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
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

var path = _interopRequireWildcard(require("path"));

function _plist() {
  const data = require("plist");

  _plist = function () {
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

function _core() {
  const data = require("../core");

  _core = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class LibUiFramework {
  constructor(version, distMacOsAppName, isUseLaunchUi) {
    this.version = version;
    this.distMacOsAppName = distMacOsAppName;
    this.isUseLaunchUi = isUseLaunchUi;
    this.name = "libui"; // noinspection JSUnusedGlobalSymbols

    this.macOsDefaultTargets = ["dmg"];
    this.defaultAppIdPrefix = "com.libui."; // noinspection JSUnusedGlobalSymbols

    this.isCopyElevateHelper = false; // noinspection JSUnusedGlobalSymbols

    this.isNpmRebuildRequired = false;
  }

  prepareApplicationStageDirectory(options) {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      yield (0, _fsExtraP().emptyDir)(options.appOutDir);
      const packager = options.packager;
      const platform = packager.platform;

      if (_this.isUseLaunchUiForPlatform(platform)) {
        const appOutDir = options.appOutDir;
        yield (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", _this.version, "--use-launch-ui", "--platform", platform.nodeName, "--arch", options.arch, "--stage", appOutDir, "--executable", `${packager.appInfo.productFilename}${platform === _core().Platform.WINDOWS ? ".exe" : ""}`]);
        return;
      }

      if (platform === _core().Platform.MAC) {
        yield _this.prepareMacosApplicationStageDirectory(packager, options);
      } else if (platform === _core().Platform.LINUX) {
        yield _this.prepareLinuxApplicationStageDirectory(options);
      }
    })();
  }

  prepareMacosApplicationStageDirectory(packager, options) {
    var _this2 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const appContentsDir = path.join(options.appOutDir, _this2.distMacOsAppName, "Contents");
      yield (0, _fsExtraP().ensureDir)(path.join(appContentsDir, "Resources"));
      yield (0, _fsExtraP().ensureDir)(path.join(appContentsDir, "MacOS"));
      yield (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", _this2.version, "--platform", "darwin", "--stage", path.join(appContentsDir, "MacOS")]);
      const appPlist = {
        // https://github.com/albe-rosado/create-proton-app/issues/13
        NSHighResolutionCapable: true
      };
      yield packager.applyCommonInfo(appPlist, appContentsDir);
      yield Promise.all([(0, _fsExtraP().writeFile)(path.join(appContentsDir, "Info.plist"), (0, _plist().build)(appPlist)), writeExecutableMain(path.join(appContentsDir, "MacOS", appPlist.CFBundleExecutable), `#!/bin/sh
  DIR=$(dirname "$0")
  "$DIR/node" "$DIR/../Resources/app/${options.packager.info.metadata.main || "index.js"}"
  `)]);
    })();
  }

  prepareLinuxApplicationStageDirectory(options) {
    var _this3 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const appOutDir = options.appOutDir;
      yield (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", _this3.version, "--platform", "linux", "--arch", options.arch, "--stage", appOutDir]);
      const mainPath = path.join(appOutDir, options.packager.executableName);
      yield writeExecutableMain(mainPath, `#!/bin/sh
  DIR=$(dirname "$0")
  "$DIR/node" "$DIR/app/${options.packager.info.metadata.main || "index.js"}"
  `);
    })();
  }

  afterPack(context) {
    var _this4 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const packager = context.packager;

      if (!_this4.isUseLaunchUiForPlatform(packager.platform)) {
        return;
      } // LaunchUI requires main.js, rename if need


      const userMain = packager.info.metadata.main || "index.js";

      if (userMain === "main.js") {
        return;
      }

      yield (0, _fsExtraP().rename)(path.join(context.appOutDir, "app", userMain), path.join(context.appOutDir, "app", "main.js"));
    })();
  }

  getMainFile(platform) {
    return this.isUseLaunchUiForPlatform(platform) ? "main.js" : null;
  }

  isUseLaunchUiForPlatform(platform) {
    return platform === _core().Platform.WINDOWS || this.isUseLaunchUi && platform === _core().Platform.LINUX;
  }

  getExcludedDependencies(platform) {
    // part of launchui
    return this.isUseLaunchUiForPlatform(platform) ? ["libui-node"] : null;
  }

}

exports.LibUiFramework = LibUiFramework;

function writeExecutableMain(_x, _x2) {
  return _writeExecutableMain.apply(this, arguments);
} function _writeExecutableMain() {
  _writeExecutableMain = (0, _bluebirdLst().coroutine)(function* (file, content) {
    yield (0, _fsExtraP().writeFile)(file, content, {
      mode: 0o755
    });
    yield (0, _fsExtraP().chmod)(file, 0o755);
  });
  return _writeExecutableMain.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=LibUiFramework.js.map