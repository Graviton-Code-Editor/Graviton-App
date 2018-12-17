"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = download;
exports.getBinFromGithub = getBinFromGithub;
exports.getBin = getBin;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

const versionToPromise = new Map();

function download(url, output, checksum) {
  const args = ["download", "--url", url, "--output", output];

  if (checksum != null) {
    args.push("--sha512", checksum);
  }

  return (0, _builderUtil().executeAppBuilder)(args);
}

function getBinFromGithub(name, version, checksum) {
  const dirName = `${name}-${version}`;
  return getBin(dirName, `https://github.com/electron-userland/electron-builder-binaries/releases/download/${dirName}/${dirName}.7z`, checksum);
}

function getBin(name, url, checksum) {
  let promise = versionToPromise.get(name); // if rejected, we will try to download again

  if (promise != null) {
    return promise;
  }

  promise = doGetBin(name, url, checksum);
  versionToPromise.set(name, promise);
  return promise;
}

function doGetBin(name, url, checksum) {
  const args = ["download-artifact", "--name", name];

  if (url != null) {
    args.push("--url", url);
  }

  if (checksum != null) {
    args.push("--sha512", checksum);
  }

  return (0, _builderUtil().executeAppBuilder)(args);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=binDownload.js.map