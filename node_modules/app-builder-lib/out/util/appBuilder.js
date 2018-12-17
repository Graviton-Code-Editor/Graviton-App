"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeAppBuilderAsJson = executeAppBuilderAsJson;
exports.objectToArgs = objectToArgs;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function executeAppBuilderAsJson(args) {
  return (0, _builderUtil().executeAppBuilder)(args).then(rawResult => {
    try {
      return JSON.parse(rawResult);
    } catch (e) {
      throw new Error(`Cannot parse result: ${e.message}: "${rawResult}"`);
    }
  });
}

function objectToArgs(to, argNameToValue) {
  for (const name of Object.keys(argNameToValue)) {
    const value = argNameToValue[name];

    if (value != null) {
      to.push(`--${name}`, value);
    }
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=appBuilder.js.map