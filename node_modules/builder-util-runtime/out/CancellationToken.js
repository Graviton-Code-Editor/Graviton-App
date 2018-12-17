"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancellationError = exports.CancellationToken = void 0;

function _events() {
  const data = require("events");

  _events = function () {
    return data;
  };

  return data;
}

class CancellationToken extends _events().EventEmitter {
  // babel cannot compile ... correctly for super calls
  constructor(parent) {
    super();
    this.parentCancelHandler = null;
    this._parent = null;
    this._cancelled = false;

    if (parent != null) {
      this.parent = parent;
    }
  }

  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }

  set parent(value) {
    this.removeParentCancelHandler();
    this._parent = value;

    this.parentCancelHandler = () => this.cancel();

    this._parent.onCancel(this.parentCancelHandler);
  }

  cancel() {
    this._cancelled = true;
    this.emit("cancel");
  }

  onCancel(handler) {
    if (this.cancelled) {
      handler();
    } else {
      this.once("cancel", handler);
    }
  }

  createPromise(callback) {
    if (this.cancelled) {
      return Promise.reject(new CancellationError());
    }

    const finallyHandler = () => {
      if (cancelHandler != null) {
        try {
          this.removeListener("cancel", cancelHandler);
          cancelHandler = null;
        } catch (ignore) {// ignore
        }
      }
    };

    let cancelHandler = null;
    return new Promise((resolve, reject) => {
      let addedCancelHandler = null;

      cancelHandler = () => {
        try {
          if (addedCancelHandler != null) {
            addedCancelHandler();
            addedCancelHandler = null;
          }
        } finally {
          reject(new CancellationError());
        }
      };

      if (this.cancelled) {
        cancelHandler();
        return;
      }

      this.onCancel(cancelHandler);
      callback(resolve, reject, callback => {
        addedCancelHandler = callback;
      });
    }).then(it => {
      finallyHandler();
      return it;
    }).catch(e => {
      finallyHandler();
      throw e;
    });
  }

  removeParentCancelHandler() {
    const parent = this._parent;

    if (parent != null && this.parentCancelHandler != null) {
      parent.removeListener("cancel", this.parentCancelHandler);
      this.parentCancelHandler = null;
    }
  }

  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners();
      this._parent = null;
    }
  }

}

exports.CancellationToken = CancellationToken;

class CancellationError extends Error {
  constructor() {
    super("Cancelled");
  }

} exports.CancellationError = CancellationError;
// __ts-babel@6.0.4
//# sourceMappingURL=CancellationToken.js.map