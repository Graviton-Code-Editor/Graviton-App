/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"

module.exports = {
  Switch: class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
        <div class="${this.getAttribute("class")} switch">
            <div></div>
        </div>`;
      this.addEventListener("click", function() {
        const dot = this.children[0];
        if (this.classList.contains("disabled") === false) {
          if (this.getState(this)) {
            this.classList.replace("activated", "desactivated");
            dot.classList.replace("activated", "desactivated");
          } else {
            this.classList.replace("desactivated", "activated");
            dot.classList.replace("desactivated", "activated");
          }
        }
      });
    }
    getState(element) {
      if (element.classList.contains("disabled")) {
        return "disabled";
      } else {
        return element.classList.contains("activated");
      }
    }
  }
};
