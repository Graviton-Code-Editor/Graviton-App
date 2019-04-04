"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinuxTargetHelper = exports.installPrefix = void 0;

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

const installPrefix = "/opt";
exports.installPrefix = installPrefix;

class LinuxTargetHelper {
  constructor(packager) {
    this.packager = packager;
    this.iconPromise = new (_lazyVal().Lazy)(() => this.computeDesktopIcons());
    this.maxIconPath = null;
  }

  get icons() {
    return this.iconPromise.value;
  } // must be name without spaces and other special characters, but not product name used


  computeDesktopIcons() {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const packager = _this.packager;
      const iconDir = packager.platformSpecificBuildOptions.icon;
      const sources = iconDir == null ? [] : [iconDir];
      const commonConfiguration = packager.config;
      const icnsPath = (commonConfiguration.mac || {}).icon || commonConfiguration.icon;

      if (icnsPath != null) {
        sources.push(icnsPath);
      } // need to put here and not as default because need to resolve image size


      const result = yield packager.resolveIcon(sources, (0, _builderUtil().asArray)(packager.getDefaultFrameworkIcon()), "set");
      _this.maxIconPath = result[result.length - 1].file;
      return result;
    })();
  }

  getDescription(options) {
    return options.description || this.packager.appInfo.description;
  }

  writeDesktopEntry(targetSpecificOptions, exec, destination, extra) {
    var _this2 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const data = yield _this2.computeDesktopEntry(targetSpecificOptions, exec, extra);
      const file = destination || (yield _this2.packager.getTempFile(`${_this2.packager.appInfo.productFilename}.desktop`));
      yield (0, _fsExtraP().outputFile)(file, data);
      return file;
    })();
  }

  computeDesktopEntry(targetSpecificOptions, exec, extra) {
    var _this3 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      if (exec != null && exec.length === 0) {
        throw new Error("Specified exec is empty");
      } // https://github.com/electron-userland/electron-builder/issues/3418


      if (targetSpecificOptions.desktop != null && targetSpecificOptions.desktop.Exec != null) {
        throw new Error("Please specify executable name as linux.executableName instead of linux.desktop.Exec");
      }

      const packager = _this3.packager;
      const appInfo = packager.appInfo;
      const productFilename = appInfo.productFilename;
      const desktopMeta = Object.assign({
        Name: appInfo.productName,
        Comment: _this3.getDescription(targetSpecificOptions),
        Exec: exec == null ? `"${installPrefix}/${productFilename}/${packager.executableName}" %U` : exec,
        Terminal: "false",
        Type: "Application",
        Icon: packager.executableName,
        // https://askubuntu.com/questions/367396/what-represent-the-startupwmclass-field-of-a-desktop-file
        // must be set to package.json name (because it is Electron set WM_CLASS)
        // to get WM_CLASS of running window: xprop WM_CLASS
        // StartupWMClass doesn't work for unicode
        // https://github.com/electron/electron/blob/2-0-x/atom/browser/native_window_views.cc#L226
        StartupWMClass: appInfo.productName
      }, extra, targetSpecificOptions.desktop);
      const mimeTypes = (0, _builderUtil().asArray)(targetSpecificOptions.mimeTypes);

      for (const fileAssociation of packager.fileAssociations) {
        if (fileAssociation.mimeType != null) {
          mimeTypes.push(fileAssociation.mimeType);
        }
      }

      for (const protocol of (0, _builderUtil().asArray)(packager.config.protocols).concat((0, _builderUtil().asArray)(packager.platformSpecificBuildOptions.protocols))) {
        for (const scheme of (0, _builderUtil().asArray)(protocol.schemes)) {
          mimeTypes.push(`x-scheme-handler/${scheme}`);
        }
      }

      if (mimeTypes.length !== 0) {
        desktopMeta.MimeType = mimeTypes.join(";") + ";";
      }

      let category = targetSpecificOptions.category;

      if ((0, _builderUtil().isEmptyOrSpaces)(category)) {
        const macCategory = (packager.config.mac || {}).category;

        if (macCategory != null) {
          category = macToLinuxCategory[macCategory];
        }

        if (category == null) {
          // https://github.com/develar/onshape-desktop-shell/issues/48
          if (macCategory != null) {
            _builderUtil().log.warn({
              macCategory
            }, "cannot map macOS category to Linux. If possible mapping is known for you, please file issue to add it.");
          }

          _builderUtil().log.warn({
            reason: "linux.category is not set and cannot map from macOS",
            docs: "https://www.electron.build/configuration/linux"
          }, "application Linux category is set to default \"Utility\"");

          category = "Utility";
        }
      }

      desktopMeta.Categories = `${category}${category.endsWith(";") ? "" : ";"}`;
      let data = `[Desktop Entry]`;

      for (const name of Object.keys(desktopMeta)) {
        data += `\n${name}=${desktopMeta[name]}`;
      }

      data += "\n";
      return data;
    })();
  }

}

exports.LinuxTargetHelper = LinuxTargetHelper;
const macToLinuxCategory = {
  "public.app-category.graphics-design": "Graphics",
  "public.app-category.developer-tools": "Development",
  "public.app-category.education": "Education",
  "public.app-category.games": "Game",
  "public.app-category.video": "Video;AudioVideo",
  "public.app-category.utilities": "Utility",
  "public.app-category.social-networking": "Network;Chat",
  "public.app-category.finance": "Office;Finance"
}; 
// __ts-babel@6.0.4
//# sourceMappingURL=LinuxTargetHelper.js.map