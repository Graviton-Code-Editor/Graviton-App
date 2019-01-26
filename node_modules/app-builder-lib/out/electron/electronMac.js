"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMacApp = createMacApp;

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

function _promise() {
  const data = require("builder-util/out/promise");

  _promise = function () {
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

function _appInfo() {
  const data = require("../appInfo");

  _appInfo = function () {
    return data;
  };

  return data;
}

function _platformPackager() {
  const data = require("../platformPackager");

  _platformPackager = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function doRename(basePath, oldName, newName) {
  return (0, _fsExtraP().rename)(path.join(basePath, oldName), path.join(basePath, newName));
}

function moveHelpers(helperSuffixes, frameworksPath, appName, prefix) {
  return _bluebirdLst().default.map(helperSuffixes, suffix => {
    const executableBasePath = path.join(frameworksPath, `${prefix}${suffix}.app`, "Contents", "MacOS");
    return doRename(executableBasePath, `${prefix}${suffix}`, appName + suffix).then(() => doRename(frameworksPath, `${prefix}${suffix}.app`, `${appName}${suffix}.app`));
  });
}

function getAvailableHelperSuffixes(helperEHPlist, helperNPPlist) {
  const result = [" Helper"];

  if (helperEHPlist != null) {
    result.push(" Helper EH");
  }

  if (helperNPPlist != null) {
    result.push(" Helper NP");
  }

  return result;
}
/** @internal */


function createMacApp(_x, _x2, _x3, _x4) {
  return _createMacApp.apply(this, arguments);
}

function _createMacApp() {
  _createMacApp = (0, _bluebirdLst().coroutine)(function* (packager, appOutDir, asarIntegrity, isMas) {
    const appInfo = packager.appInfo;
    const appFilename = appInfo.productFilename;
    const contentsPath = path.join(appOutDir, packager.info.framework.distMacOsAppName, "Contents");
    const frameworksPath = path.join(contentsPath, "Frameworks");
    const loginItemPath = path.join(contentsPath, "Library", "LoginItems");
    const appPlistFilename = path.join(contentsPath, "Info.plist");
    const helperPlistFilename = path.join(frameworksPath, `${packager.electronDistMacOsExecutableName} Helper.app`, "Contents", "Info.plist");
    const helperEHPlistFilename = path.join(frameworksPath, `${packager.electronDistMacOsExecutableName} Helper EH.app`, "Contents", "Info.plist");
    const helperNPPlistFilename = path.join(frameworksPath, `${packager.electronDistMacOsExecutableName} Helper NP.app`, "Contents", "Info.plist");
    const helperLoginPlistFilename = path.join(loginItemPath, `${packager.electronDistMacOsExecutableName} Login Helper.app`, "Contents", "Info.plist");
    const buildMetadata = packager.config;
    const fileContents = yield _bluebirdLst().default.map([appPlistFilename, helperPlistFilename, helperEHPlistFilename, helperNPPlistFilename, helperLoginPlistFilename, buildMetadata["extend-info"]], it => it == null ? it : (0, _promise().orIfFileNotExist)((0, _fsExtraP().readFile)(it, "utf8"), null));
    const appPlist = (0, _plist().parse)(fileContents[0]);
    const helperPlist = (0, _plist().parse)(fileContents[1]);
    const helperEHPlist = fileContents[2] == null ? null : (0, _plist().parse)(fileContents[2]);
    const helperNPPlist = fileContents[3] == null ? null : (0, _plist().parse)(fileContents[3]);
    const helperLoginPlist = fileContents[4] == null ? null : (0, _plist().parse)(fileContents[4]); // if an extend-info file was supplied, copy its contents in first

    if (fileContents[5] != null) {
      Object.assign(appPlist, (0, _plist().parse)(fileContents[5]));
    }

    const oldHelperBundleId = buildMetadata["helper-bundle-id"];

    if (oldHelperBundleId != null) {
      _builderUtil().log.warn("build.helper-bundle-id is deprecated, please set as build.mac.helperBundleId");
    }

    const helperBundleIdentifier = (0, _appInfo().filterCFBundleIdentifier)(packager.platformSpecificBuildOptions.helperBundleId || oldHelperBundleId || `${appInfo.macBundleIdentifier}.helper`);
    yield packager.applyCommonInfo(appPlist, contentsPath); // required for electron-updater proxy

    if (!isMas) {
      configureLocalhostAts(appPlist);
    }

    helperPlist.CFBundleExecutable = `${appFilename} Helper`;
    helperPlist.CFBundleDisplayName = `${appInfo.productName} Helper`;
    helperPlist.CFBundleIdentifier = helperBundleIdentifier;
    helperPlist.CFBundleVersion = appPlist.CFBundleVersion;

    function configureHelper(helper, postfix) {
      helper.CFBundleExecutable = `${appFilename} Helper ${postfix}`;
      helper.CFBundleDisplayName = `${appInfo.productName} Helper ${postfix}`;
      helper.CFBundleIdentifier = `${helperBundleIdentifier}.${postfix}`;
      helper.CFBundleVersion = appPlist.CFBundleVersion;
    }

    if (helperEHPlist != null) {
      configureHelper(helperEHPlist, "EH");
    }

    if (helperNPPlist != null) {
      configureHelper(helperNPPlist, "NP");
    }

    if (helperLoginPlist != null) {
      helperLoginPlist.CFBundleExecutable = `${appFilename} Login Helper`;
      helperLoginPlist.CFBundleDisplayName = `${appInfo.productName} Login Helper`; // noinspection SpellCheckingInspection

      helperLoginPlist.CFBundleIdentifier = `${appInfo.macBundleIdentifier}.loginhelper`;
      helperLoginPlist.CFBundleVersion = appPlist.CFBundleVersion;
    }

    const protocols = (0, _builderUtil().asArray)(buildMetadata.protocols).concat((0, _builderUtil().asArray)(packager.platformSpecificBuildOptions.protocols));

    if (protocols.length > 0) {
      appPlist.CFBundleURLTypes = protocols.map(protocol => {
        const schemes = (0, _builderUtil().asArray)(protocol.schemes);

        if (schemes.length === 0) {
          throw new (_builderUtil().InvalidConfigurationError)(`Protocol "${protocol.name}": must be at least one scheme specified`);
        }

        return {
          CFBundleURLName: protocol.name,
          CFBundleTypeRole: protocol.role || "Editor",
          CFBundleURLSchemes: schemes.slice()
        };
      });
    }

    const fileAssociations = packager.fileAssociations;

    if (fileAssociations.length > 0) {
      appPlist.CFBundleDocumentTypes = yield _bluebirdLst().default.map(fileAssociations,
      /*#__PURE__*/
      function () {
        var _ref = (0, _bluebirdLst().coroutine)(function* (fileAssociation) {
          const extensions = (0, _builderUtil().asArray)(fileAssociation.ext).map(_platformPackager().normalizeExt);
          const customIcon = yield packager.getResource((0, _builderUtil().getPlatformIconFileName)(fileAssociation.icon, true), `${extensions[0]}.icns`);
          let iconFile = appPlist.CFBundleIconFile;

          if (customIcon != null) {
            iconFile = path.basename(customIcon);
            yield (0, _fs().copyOrLinkFile)(customIcon, path.join(path.join(contentsPath, "Resources"), iconFile));
          }

          const result = {
            CFBundleTypeExtensions: extensions,
            CFBundleTypeName: fileAssociation.name || extensions[0],
            CFBundleTypeRole: fileAssociation.role || "Editor",
            CFBundleTypeIconFile: iconFile
          };

          if (fileAssociation.isPackage) {
            result.LSTypeIsPackage = true;
          }

          return result;
        });

        return function (_x5) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    if (asarIntegrity != null) {
      appPlist.AsarIntegrity = JSON.stringify(asarIntegrity);
    }

    yield Promise.all([(0, _fsExtraP().writeFile)(appPlistFilename, (0, _plist().build)(appPlist)), (0, _fsExtraP().writeFile)(helperPlistFilename, (0, _plist().build)(helperPlist)), helperEHPlist == null ? Promise.resolve() : (0, _fsExtraP().writeFile)(helperEHPlistFilename, (0, _plist().build)(helperEHPlist)), helperNPPlist == null ? Promise.resolve() : (0, _fsExtraP().writeFile)(helperNPPlistFilename, (0, _plist().build)(helperNPPlist)), helperLoginPlist == null ? Promise.resolve() : (0, _fsExtraP().writeFile)(helperLoginPlistFilename, (0, _plist().build)(helperLoginPlist)), doRename(path.join(contentsPath, "MacOS"), packager.electronDistMacOsExecutableName, appPlist.CFBundleExecutable), (0, _fs().unlinkIfExists)(path.join(appOutDir, "LICENSE")), (0, _fs().unlinkIfExists)(path.join(appOutDir, "LICENSES.chromium.html"))]);
    yield moveHelpers(getAvailableHelperSuffixes(helperEHPlist, helperNPPlist), frameworksPath, appFilename, packager.electronDistMacOsExecutableName);

    if (helperLoginPlist != null) {
      const prefix = packager.electronDistMacOsExecutableName;
      const suffix = " Login Helper";
      const executableBasePath = path.join(loginItemPath, `${prefix}${suffix}.app`, "Contents", "MacOS");
      yield doRename(executableBasePath, `${prefix}${suffix}`, appFilename + suffix).then(() => doRename(loginItemPath, `${prefix}${suffix}.app`, `${appFilename}${suffix}.app`));
    }

    const appPath = path.join(appOutDir, `${appFilename}.app`);
    yield (0, _fsExtraP().rename)(path.dirname(contentsPath), appPath); // https://github.com/electron-userland/electron-builder/issues/840

    const now = Date.now() / 1000;
    yield (0, _fsExtraP().utimes)(appPath, now, now);
  });
  return _createMacApp.apply(this, arguments);
}

function configureLocalhostAts(appPlist) {
  // https://bencoding.com/2015/07/20/app-transport-security-and-localhost/
  let ats = appPlist.NSAppTransportSecurity;

  if (ats == null) {
    ats = {};
    appPlist.NSAppTransportSecurity = ats;
  }

  ats.NSAllowsLocalNetworking = true; // https://github.com/electron-userland/electron-builder/issues/3377#issuecomment-446035814

  ats.NSAllowsArbitraryLoads = true;
  let exceptionDomains = ats.NSExceptionDomains;

  if (exceptionDomains == null) {
    exceptionDomains = {};
    ats.NSExceptionDomains = exceptionDomains;
  }

  if (exceptionDomains.localhost == null) {
    const allowHttp = {
      NSTemporaryExceptionAllowsInsecureHTTPSLoads: false,
      NSIncludesSubdomains: false,
      NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
      NSTemporaryExceptionMinimumTLSVersion: "1.0",
      NSTemporaryExceptionRequiresForwardSecrecy: false
    };
    exceptionDomains.localhost = allowHttp;
    exceptionDomains["127.0.0.1"] = allowHttp;
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=electronMac.js.map