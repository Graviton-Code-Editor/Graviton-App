"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLibOrExe = isLibOrExe;
exports.detectUnpackedDirs = detectUnpackedDirs;

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

function _isbinaryfile() {
  const data = require("isbinaryfile");

  _isbinaryfile = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _fileTransformer() {
  const data = require("../fileTransformer");

  _fileTransformer = function () {
    return data;
  };

  return data;
}

function _appFileCopier() {
  const data = require("../util/appFileCopier");

  _appFileCopier = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function addValue(map, key, value) {
  let list = map.get(key);

  if (list == null) {
    list = [value];
    map.set(key, list);
  } else {
    list.push(value);
  }
}

function isLibOrExe(file) {
  return file.endsWith(".dll") || file.endsWith(".exe") || file.endsWith(".dylib") || file.endsWith(".so");
}
/** @internal */


function detectUnpackedDirs(_x, _x2, _x3, _x4) {
  return _detectUnpackedDirs.apply(this, arguments);
} function _detectUnpackedDirs() {
  _detectUnpackedDirs = (0, _bluebirdLst().coroutine)(function* (fileSet, autoUnpackDirs, unpackedDest, rootForAppFilesWithoutAsar) {
    const dirToCreate = new Map();
    const metadata = fileSet.metadata;

    function addParents(child, root) {
      child = path.dirname(child);

      if (autoUnpackDirs.has(child)) {
        return;
      }

      do {
        autoUnpackDirs.add(child);
        const p = path.dirname(child); // create parent dir to be able to copy file later without directory existence check

        addValue(dirToCreate, p, path.basename(child));

        if (child === root || p === root || autoUnpackDirs.has(p)) {
          break;
        }

        child = p;
      } while (true);

      autoUnpackDirs.add(root);
    }

    for (let i = 0, n = fileSet.files.length; i < n; i++) {
      const file = fileSet.files[i];
      const index = file.lastIndexOf(_fileTransformer().NODE_MODULES_PATTERN);

      if (index < 0) {
        continue;
      }

      let nextSlashIndex = file.indexOf(path.sep, index + _fileTransformer().NODE_MODULES_PATTERN.length + 1);

      if (nextSlashIndex < 0) {
        continue;
      }

      if (file[index + _fileTransformer().NODE_MODULES_PATTERN.length] === "@") {
        nextSlashIndex = file.indexOf(path.sep, nextSlashIndex + 1);
      }

      if (!metadata.get(file).isFile()) {
        continue;
      }

      const packageDir = file.substring(0, nextSlashIndex);
      const packageDirPathInArchive = path.relative(rootForAppFilesWithoutAsar, (0, _appFileCopier().getDestinationPath)(packageDir, fileSet));
      const pathInArchive = path.relative(rootForAppFilesWithoutAsar, (0, _appFileCopier().getDestinationPath)(file, fileSet));

      if (autoUnpackDirs.has(packageDirPathInArchive)) {
        // if package dir is unpacked, any file also unpacked
        addParents(pathInArchive, packageDirPathInArchive);
        continue;
      } // https://github.com/electron-userland/electron-builder/issues/2679


      let shouldUnpack = false; // ffprobe-static and ffmpeg-static are known packages to always unpack

      const moduleName = path.basename(packageDir);

      if (moduleName === "ffprobe-static" || moduleName === "ffmpeg-static" || isLibOrExe(file)) {
        shouldUnpack = true;
      } else if (!file.includes(".", nextSlashIndex) && path.extname(file) === "") {
        shouldUnpack = yield (0, _isbinaryfile().isBinaryFile)(file);
      }

      if (!shouldUnpack) {
        continue;
      }

      if (_builderUtil().log.isDebugEnabled) {
        _builderUtil().log.debug({
          file: pathInArchive,
          reason: "contains executable code"
        }, "not packed into asar archive");
      }

      addParents(pathInArchive, packageDirPathInArchive);
    }

    if (dirToCreate.size > 0) {
      yield (0, _fsExtraP().ensureDir)(unpackedDest + path.sep + "node_modules"); // child directories should be not created asynchronously - parent directories should be created first

      yield _bluebirdLst().default.map(dirToCreate.keys(),
      /*#__PURE__*/
      function () {
        var _ref = (0, _bluebirdLst().coroutine)(function* (parentDir) {
          const base = unpackedDest + path.sep + parentDir;
          yield (0, _fsExtraP().ensureDir)(base);
          yield _bluebirdLst().default.each(dirToCreate.get(parentDir), it => {
            if (dirToCreate.has(parentDir + path.sep + it)) {
              // already created
              return null;
            } else {
              return (0, _fsExtraP().ensureDir)(base + path.sep + it);
            }
          });
        });

        return function (_x5) {
          return _ref.apply(this, arguments);
        };
      }(), _fs().CONCURRENCY);
    }
  });
  return _detectUnpackedDirs.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=unpackDetector.js.map