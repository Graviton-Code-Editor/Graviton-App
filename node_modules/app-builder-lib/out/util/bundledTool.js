"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeEnv = computeEnv;
exports.computeToolEnv = computeToolEnv;

function computeEnv(oldValue, newValues) {
  const parsedOldValue = oldValue ? oldValue.split(":") : [];
  return newValues.concat(parsedOldValue).filter(it => it.length > 0).join(":");
}

function computeToolEnv(libPath) {
  // noinspection SpellCheckingInspection
  return Object.assign({}, process.env, {
    DYLD_LIBRARY_PATH: computeEnv(process.env.DYLD_LIBRARY_PATH, libPath)
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=bundledTool.js.map