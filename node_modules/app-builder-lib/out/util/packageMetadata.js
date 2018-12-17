"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPackageJson = readPackageJson;
exports.checkMetadata = checkMetadata;

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

var path = _interopRequireWildcard(require("path"));

function semver() {
  const data = _interopRequireWildcard(require("semver"));

  semver = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const normalizeData = require("normalize-package-data");
/** @internal */


function readPackageJson(_x) {
  return _readPackageJson.apply(this, arguments);
}

function _readPackageJson() {
  _readPackageJson = (0, _bluebirdLst().coroutine)(function* (file) {
    const data = yield (0, _fsExtraP().readJson)(file);
    yield authors(file, data);
    normalizeData(data); // remove not required fields because can be used for remote build

    delete data.scripts;
    delete data.readme;
    return data;
  });
  return _readPackageJson.apply(this, arguments);
}

function authors(_x2, _x3) {
  return _authors.apply(this, arguments);
}
/** @internal */


function _authors() {
  _authors = (0, _bluebirdLst().coroutine)(function* (file, data) {
    if (data.contributors != null) {
      return;
    }

    let authorData;

    try {
      authorData = yield (0, _fsExtraP().readFile)(path.resolve(path.dirname(file), "AUTHORS"), "utf8");
    } catch (ignored) {
      return;
    }

    data.contributors = authorData.split(/\r?\n/g).map(it => it.replace(/^\s*#.*$/, "").trim());
  });
  return _authors.apply(this, arguments);
}

function checkMetadata(metadata, devMetadata, appPackageFile, devAppPackageFile) {
  const errors = [];

  const reportError = missedFieldName => {
    errors.push(`Please specify '${missedFieldName}' in the package.json (${appPackageFile})`);
  };

  const checkNotEmpty = (name, value) => {
    if ((0, _builderUtil().isEmptyOrSpaces)(value)) {
      reportError(name);
    }
  };

  if (metadata.directories != null) {
    errors.push(`"directories" in the root is deprecated, please specify in the "build"`);
  }

  checkNotEmpty("name", metadata.name);

  if ((0, _builderUtil().isEmptyOrSpaces)(metadata.description)) {
    _builderUtil().log.warn({
      appPackageFile
    }, `description is missed in the package.json`);
  }

  if (metadata.author == null) {
    _builderUtil().log.warn({
      appPackageFile
    }, `author is missed in the package.json`);
  }

  checkNotEmpty("version", metadata.version);

  if (metadata != null) {
    checkDependencies(metadata.dependencies, errors);
  }

  if (metadata !== devMetadata) {
    if (metadata.build != null) {
      errors.push(`'build' in the application package.json (${appPackageFile}) is not supported since 3.0 anymore. Please move 'build' into the development package.json (${devAppPackageFile})`);
    }
  }

  const devDependencies = metadata.devDependencies;

  if (devDependencies != null && "electron-rebuild" in devDependencies) {
    _builderUtil().log.info('electron-rebuild not required if you use electron-builder, please consider to remove excess dependency from devDependencies\n\nTo ensure your native dependencies are always matched electron version, simply add script `"postinstall": "electron-builder install-app-deps" to your `package.json`');
  }

  if (errors.length > 0) {
    throw new (_builderUtil().InvalidConfigurationError)(errors.join("\n"));
  }
}

function versionSatisfies(version, range, loose) {
  if (version == null) {
    return false;
  }

  const coerced = semver().coerce(version);

  if (coerced == null) {
    return false;
  }

  return semver().satisfies(coerced, range, loose);
}

function checkDependencies(dependencies, errors) {
  if (dependencies == null) {
    return;
  }

  const updaterVersion = dependencies["electron-updater"];
  const requiredElectronUpdaterVersion = "4.0.0";

  if (updaterVersion != null && !versionSatisfies(updaterVersion, `>=${requiredElectronUpdaterVersion}`)) {
    errors.push(`At least electron-updater ${requiredElectronUpdaterVersion} is recommended by current electron-builder version. Please set electron-updater version to "^${requiredElectronUpdaterVersion}"`);
  }

  const swVersion = dependencies["electron-builder-squirrel-windows"];

  if (swVersion != null && !versionSatisfies(swVersion, ">=20.32.0")) {
    errors.push(`At least electron-builder-squirrel-windows 20.32.0 is required by current electron-builder version. Please set electron-builder-squirrel-windows to "^20.32.0"`);
  }

  const deps = ["electron", "electron-prebuilt", "electron-rebuild"];

  if (process.env.ALLOW_ELECTRON_BUILDER_AS_PRODUCTION_DEPENDENCY !== "true") {
    deps.push("electron-builder");
  }

  for (const name of deps) {
    if (name in dependencies) {
      errors.push(`Package "${name}" is only allowed in "devDependencies". ` + `Please remove it from the "dependencies" section in your package.json.`);
    }
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=packageMetadata.js.map