/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict";
/**
 *
 * @desc This is a web component for making switches
 *
 */
module.exports = class Switch extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <div class="${this.getAttribute("class")} switch">
          <div></div>
      </div>`;
    this.toggle = function() {
      const dot = this.children[0];
      if (this.classList.contains("disabled") === false) {
        if (this.getState()) {
          this.classList.replace("activated", "desactivated");
          dot.classList.replace("activated", "desactivated");
        } else {
          this.classList.replace("desactivated", "activated");
          dot.classList.replace("desactivated", "activated");
        }
      }
    };
    this.addEventListener("click", ()=> this.toggle())
  }
  getState() {
    if (this.classList.contains("disabled")) {
      return "disabled";
    } else {
      return this.classList.contains("activated");
    }
  }
};
