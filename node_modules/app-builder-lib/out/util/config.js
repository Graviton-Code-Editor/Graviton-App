"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.doMergeConfigs = doMergeConfigs;
exports.validateConfig = validateConfig;
exports.computeDefaultAppDirectory = computeDefaultAppDirectory;

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

function _readConfigFile() {
  const data = require("read-config-file");

  _readConfigFile = function () {
    return data;
  };

  return data;
}

function _rectCra() {
  const data = require("../presets/rectCra");

  _rectCra = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://github.com/electron-userland/electron-builder/issues/1847
function mergePublish(config, configFromOptions) {
  // if config from disk doesn't have publish (or object), no need to handle, it will be simply merged by deepAssign
  const publish = Array.isArray(config.publish) ? configFromOptions.publish : null;

  if (publish != null) {
    delete configFromOptions.publish;
  }

  (0, _builderUtil().deepAssign)(config, configFromOptions);

  if (publish == null) {
    return;
  }

  const listOnDisk = config.publish;

  if (listOnDisk.length === 0) {
    config.publish = publish;
  } else {
    // apply to first
    Object.assign(listOnDisk[0], publish);
  }
}

function getConfig(_x, _x2, _x3) {
  return _getConfig2.apply(this, arguments);
} // normalize for easy merge


function _getConfig2() {
  _getConfig2 = (0, _bluebirdLst().coroutine)(function* (projectDir, configPath, configFromOptions, packageMetadata = new (_lazyVal().Lazy)(() => (0, _readConfigFile().orNullIfFileNotExist)((0, _fsExtraP().readJson)(path.join(projectDir, "package.json"))))) {
    const configRequest = {
      packageKey: "build",
      configFilename: "electron-builder",
      projectDir,
      packageMetadata
    };
    const configAndEffectiveFile = yield (0, _readConfigFile().getConfig)(configRequest, configPath);
    const config = configAndEffectiveFile == null ? {} : configAndEffectiveFile.result;

    if (configFromOptions != null) {
      mergePublish(config, configFromOptions);
    }

    if (configAndEffectiveFile != null) {
      _builderUtil().log.info({
        file: configAndEffectiveFile.configFile == null ? 'package.json ("build" field)' : configAndEffectiveFile.configFile
      }, "loaded configuration");
    }

    if (config.extends == null && config.extends !== null) {
      const metadata = (yield packageMetadata.value) || {};
      const devDependencies = metadata.devDependencies;
      const dependencies = metadata.dependencies;

      if (dependencies != null && "react-scripts" in dependencies || devDependencies != null && "react-scripts" in devDependencies) {
        config.extends = "react-cra";
      } else if (devDependencies != null && "electron-webpack" in devDependencies) {
        let file = "electron-webpack/out/electron-builder.js";

        try {
          file = require.resolve(file);
        } catch (ignore) {
          file = require.resolve("electron-webpack/electron-builder.yml");
        }

        config.extends = `file:${file}`;
      }
    }

    let parentConfig;

    if (config.extends === "react-cra") {
      parentConfig = yield (0, _rectCra().reactCra)(projectDir);

      _builderUtil().log.info({
        preset: config.extends
      }, "loaded parent configuration");
    } else if (config.extends != null) {
      const parentConfigAndEffectiveFile = yield (0, _readConfigFile().loadParentConfig)(configRequest, config.extends);

      _builderUtil().log.info({
        file: parentConfigAndEffectiveFile.configFile
      }, "loaded parent configuration");

      parentConfig = parentConfigAndEffectiveFile.result;
    } else {
      parentConfig = null;
    }

    return doMergeConfigs(config, parentConfig);
  });
  return _getConfig2.apply(this, arguments);
}

function normalizeFiles(configuration, name) {
  let value = configuration[name];

  if (value == null) {
    return;
  }

  if (!Array.isArray(value)) {
    value = [value];
  }

  itemLoop: for (let i = 0; i < value.length; i++) {
    let item = value[i];

    if (typeof item === "string") {
      // merge with previous if possible
      if (i !== 0) {
        let prevItemIndex = i - 1;
        let prevItem;

        do {
          prevItem = value[prevItemIndex--];
        } while (prevItem == null);

        if (prevItem.from == null && prevItem.to == null) {
          if (prevItem.filter == null) {
            prevItem.filter = [item];
          } else {
            prevItem.filter.push(item);
          }

          value[i] = null;
          continue itemLoop;
        }
      }

      item = {
        filter: [item]
      };
      value[i] = item;
    } else if (Array.isArray(item)) {
      throw new Error(`${name} configuration is invalid, nested array not expected for index ${i}: ` + item);
    } // make sure that merge logic is not complex - unify different presentations


    if (item.from === ".") {
      item.from = undefined;
    }

    if (item.to === ".") {
      item.to = undefined;
    }

    if (item.filter != null && typeof item.filter === "string") {
      item.filter = [item.filter];
    }
  }

  configuration[name] = value.filter(it => it != null);
}

function mergeFiles(configuration, parentConfiguration, mergedConfiguration, name) {
  const list = configuration[name];
  const parentList = parentConfiguration[name];

  if (list == null || parentList == null) {
    return;
  }

  const result = list.slice();
  mergedConfiguration[name] = result;

  itemLoop: for (const item of parentConfiguration.files) {
    for (const existingItem of list) {
      if (existingItem.from === item.from && existingItem.to === item.to) {
        if (item.filter != null) {
          if (existingItem.filter == null) {
            existingItem.filter = item.filter.slice();
          } else {
            existingItem.filter = item.filter.concat(existingItem.filter);
          }
        }

        continue itemLoop;
      }
    } // existing item not found, simply add


    result.push(item);
  }
}

function doMergeConfigs(configuration, parentConfiguration) {
  normalizeFiles(configuration, "files");
  normalizeFiles(configuration, "extraFiles");
  normalizeFiles(configuration, "extraResources");

  if (parentConfiguration == null) {
    return (0, _builderUtil().deepAssign)(getDefaultConfig(), configuration);
  }

  normalizeFiles(parentConfiguration, "files");
  normalizeFiles(parentConfiguration, "extraFiles");
  normalizeFiles(parentConfiguration, "extraResources");
  const result = (0, _builderUtil().deepAssign)(getDefaultConfig(), parentConfiguration, configuration);
  mergeFiles(configuration, parentConfiguration, result, "files");
  return result;
}

function getDefaultConfig() {
  return {
    directories: {
      output: "dist",
      buildResources: "build"
    }
  };
}

const schemeDataPromise = new (_lazyVal().Lazy)(() => (0, _fsExtraP().readJson)(path.join(__dirname, "..", "..", "scheme.json")));

function validateConfig(_x4, _x5) {
  return _validateConfig2.apply(this, arguments);
}

function _validateConfig2() {
  _validateConfig2 = (0, _bluebirdLst().coroutine)(function* (config, debugLogger) {
    const extraMetadata = config.extraMetadata;

    if (extraMetadata != null) {
      if (extraMetadata.build != null) {
        throw new (_builderUtil().InvalidConfigurationError)(`--em.build is deprecated, please specify as -c"`);
      }

      if (extraMetadata.directories != null) {
        throw new (_builderUtil().InvalidConfigurationError)(`--em.directories is deprecated, please specify as -c.directories"`);
      }
    } // noinspection JSDeprecatedSymbols


    if (config.npmSkipBuildFromSource === false) {
      config.buildDependenciesFromSource = false;
    }

    yield (0, _readConfigFile().validateConfig)(config, schemeDataPromise, (message, errors) => {
      if (debugLogger.isEnabled) {
        debugLogger.add("invalidConfig", JSON.stringify(errors, null, 2));
      }

      return `${message}

How to fix:
1. Open https://electron.build/configuration/configuration
2. Search the option name on the page.
  * Not found? The option was deprecated or not exists (check spelling).
  * Found? Check that the option in the appropriate place. e.g. "title" only in the "dmg", not in the root.
`;
    });
  });
  return _validateConfig2.apply(this, arguments);
}

const DEFAULT_APP_DIR_NAMES = ["app", "www"];

function computeDefaultAppDirectory(_x6, _x7) {
  return _computeDefaultAppDirectory.apply(this, arguments);
} function _computeDefaultAppDirectory() {
  _computeDefaultAppDirectory = (0, _bluebirdLst().coroutine)(function* (projectDir, userAppDir) {
    if (userAppDir != null) {
      const absolutePath = path.resolve(projectDir, userAppDir);
      const stat = yield (0, _fs().statOrNull)(absolutePath);

      if (stat == null) {
        throw new (_builderUtil().InvalidConfigurationError)(`Application directory ${userAppDir} doesn't exist`);
      } else if (!stat.isDirectory()) {
        throw new (_builderUtil().InvalidConfigurationError)(`Application directory ${userAppDir} is not a directory`);
      } else if (projectDir === absolutePath) {
        _builderUtil().log.warn({
          appDirectory: userAppDir
        }, `Specified application directory equals to project dir — superfluous or wrong configuration`);
      }

      return absolutePath;
    }

    for (const dir of DEFAULT_APP_DIR_NAMES) {
      const absolutePath = path.join(projectDir, dir);
      const packageJson = path.join(absolutePath, "package.json");
      const stat = yield (0, _fs().statOrNull)(packageJson);

      if (stat != null && stat.isFile()) {
        return absolutePath;
      }
    }

    return projectDir;
  });
  return _computeDefaultAppDirectory.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=config.js.map