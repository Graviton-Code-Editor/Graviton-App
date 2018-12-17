"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadCertificate = downloadCertificate;

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

function _os() {
  const data = require("os");

  _os = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

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

function _binDownload() {
  const data = require("../binDownload");

  _binDownload = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/** @private */
function downloadCertificate(_x, _x2, _x3) {
  return _downloadCertificate.apply(this, arguments);
} function _downloadCertificate() {
  _downloadCertificate = (0, _bluebirdLst().coroutine)(function* (urlOrBase64, tmpDir, currentDir) {
    urlOrBase64 = urlOrBase64.trim();
    let file = null;

    if (urlOrBase64.length > 3 && urlOrBase64[1] === ":" || urlOrBase64.startsWith("/") || urlOrBase64.startsWith(".")) {
      file = urlOrBase64;
    } else if (urlOrBase64.startsWith("file://")) {
      file = urlOrBase64.substring("file://".length);
    } else if (urlOrBase64.startsWith("~/")) {
      file = path.join((0, _os().homedir)(), urlOrBase64.substring("~/".length));
    } else {
      const isUrl = urlOrBase64.startsWith("https://");

      if (isUrl || urlOrBase64.length > 2048 || urlOrBase64.endsWith("=")) {
        const tempFile = yield tmpDir.getTempFile({
          suffix: ".p12"
        });

        if (isUrl) {
          yield (0, _binDownload().download)(urlOrBase64, tempFile);
        } else {
          yield (0, _fsExtraP().outputFile)(tempFile, Buffer.from(urlOrBase64, "base64"));
        }

        return tempFile;
      } else {
        file = urlOrBase64;
      }
    }

    file = path.resolve(currentDir, file);
    const stat = yield (0, _fs().statOrNull)(file);

    if (stat == null) {
      throw new (_builderUtil().InvalidConfigurationError)(`${file} doesn't exist`);
    } else if (!stat.isFile()) {
      throw new (_builderUtil().InvalidConfigurationError)(`${file} not a file`);
    } else {
      return file;
    }
  });
  return _downloadCertificate.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=codesign.js.map