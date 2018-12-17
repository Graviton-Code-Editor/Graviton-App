"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpExecutor = exports.NodeHttpExecutor = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _http() {
  const data = require("http");

  _http = function () {
    return data;
  };

  return data;
}

function https() {
  const data = _interopRequireWildcard(require("https"));

  https = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class NodeHttpExecutor extends _builderUtilRuntime().HttpExecutor {
  // noinspection JSMethodCanBeStatic
  // noinspection JSUnusedGlobalSymbols
  createRequest(options, callback) {
    return (options.protocol === "http:" ? _http().request : https().request)(options, callback);
  }

}

exports.NodeHttpExecutor = NodeHttpExecutor;
const httpExecutor = new NodeHttpExecutor(); exports.httpExecutor = httpExecutor;
// __ts-babel@6.0.4
//# sourceMappingURL=nodeHttpExecutor.js.map