/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"
/**
 *
 * @desc This is a web component for side menus
 * @usage <gv-sidemenu>
            <side-menu>
                <side-title>Window</side-title>
                <menu-button href=AA default >Content 1</menu-button>
                <menu-button href=BB >Content 2</menu-button>
            </side-menu>
            <side-content>
                <side-page href=AA default>
                    <p>SOME CONTENT 1 </p>
                </side-page>
                <side-page href=BB>
                    <p>SOME CONTENT 2 </p>
                </side-page>
            </side-content>
        </gv-sidemenu>
 *
 */
module.exports = class GvSideMenu extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const sideMenu = this.children[0];
    const sideContent = this.children[1];
    const menuButtons = sideMenu.children;
    const contentPages = sideContent.children;

    for (i = 1; i < menuButtons.length; i++) {
      const button = menuButtons[i];
      button.addEventListener("click", () => {
        for (i = 0; i < contentPages.length; i++) {
          if (
            contentPages[i].getAttribute("href") == button.getAttribute("href")
          ) {
            contentPages[i].style.display = "block";
          } else {
            contentPages[i].style.display = "none";
          }
        }
        for (i = 0; i < menuButtons.length; i++) {
          menuButtons[i].removeAttribute("default");
          if (
            menuButtons[i].getAttribute("href") != button.getAttribute("href")
          )
            menuButtons[i].classList.remove("active");
        }
        button.classList.add("active");
      });
    }
  }
};
