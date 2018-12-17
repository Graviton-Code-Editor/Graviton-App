"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _core() {
  const data = require("../core");

  _core = function () {
    return data;
  };

  return data;
}

function _PublishManager() {
  const data = require("../publish/PublishManager");

  _PublishManager = function () {
    return data;
  };

  return data;
}

function _appBuilder() {
  const data = require("../util/appBuilder");

  _appBuilder = function () {
    return data;
  };

  return data;
}

function _license() {
  const data = require("../util/license");

  _license = function () {
    return data;
  };

  return data;
}

function _targetUtil() {
  const data = require("./targetUtil");

  _targetUtil = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://unix.stackexchange.com/questions/375191/append-to-sub-directory-inside-squashfs-file
class AppImageTarget extends _core().Target {
  constructor(ignored, packager, helper, outDir) {
    super("appImage");
    this.packager = packager;
    this.helper = helper;
    this.outDir = outDir;
    this.options = Object.assign({}, this.packager.platformSpecificBuildOptions, this.packager.config[this.name]); // we add X-AppImage-BuildId to ensure that new desktop file will be installed

    this.desktopEntry = new (_lazyVal().Lazy)(() => helper.computeDesktopEntry(this.options, "AppRun", {
      "X-AppImage-Version": `${packager.appInfo.buildVersion}`
    }));
  }

  build(appOutDir, arch) {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const packager = _this.packager;
      const options = _this.options; // https://github.com/electron-userland/electron-builder/issues/775
      // https://github.com/electron-userland/electron-builder/issues/1726
      // tslint:disable-next-line:no-invalid-template-strings

      const artifactName = packager.expandArtifactBeautyNamePattern(options, "AppImage", arch);
      const artifactPath = path.join(_this.outDir, artifactName);
      yield packager.info.callArtifactBuildStarted({
        targetPresentableName: "AppImage",
        file: artifactPath,
        arch
      });
      const c = yield Promise.all([_this.desktopEntry.value, _this.helper.icons, (0, _PublishManager().getAppUpdatePublishConfiguration)(packager, arch, false
      /* in any case validation will be done on publish */
      ), (0, _license().getNotLocalizedLicenseFile)(options.license, _this.packager, ["txt", "html"]), (0, _targetUtil().createStageDir)(_this, packager, arch)]);
      const license = c[3];
      const stageDir = c[4];
      const publishConfig = c[2];

      if (publishConfig != null) {
        yield (0, _fsExtraP().outputFile)(path.join(packager.getResourcesDir(stageDir.dir), "app-update.yml"), (0, _builderUtil().serializeToYaml)(publishConfig));
      }

      if (_this.packager.packagerOptions.effectiveOptionComputed != null && (yield _this.packager.packagerOptions.effectiveOptionComputed({
        desktop: yield _this.desktopEntry.value
      }))) {
        return;
      }

      const args = ["appimage", "--stage", stageDir.dir, "--arch", _builderUtil().Arch[arch], "--output", artifactPath, "--app", appOutDir, "--configuration", JSON.stringify(Object.assign({
        productName: _this.packager.appInfo.productName,
        desktopEntry: c[0],
        executableName: _this.packager.executableName,
        icons: c[1],
        fileAssociations: _this.packager.fileAssociations
      }, options))];
      (0, _appBuilder().objectToArgs)(args, {
        license
      });

      if (packager.compression === "maximum") {
        args.push("--compression", "xz");
      }

      yield packager.info.callArtifactBuildCompleted({
        file: artifactPath,
        safeArtifactName: packager.computeSafeArtifactName(artifactName, "AppImage", arch, false),
        target: _this,
        arch,
        packager,
        isWriteUpdateInfo: true,
        updateInfo: yield (0, _appBuilder().executeAppBuilderAsJson)(args)
      });
    })();
  }

} exports.default = AppImageTarget;
// __ts-babel@6.0.4
//# sourceMappingURL=AppImageTarget.js.map